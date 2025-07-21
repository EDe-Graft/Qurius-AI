import { images } from '@/constants/images';
import { useTheme } from '@/context/useThemeContext';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { getResponse } from '@/services/openAI';
import { useDrawerStatus } from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, FlatList, Keyboard, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useAuth } from '../../hooks/useAuth';
import { DatabaseService } from '../../services/database';
import getMarkdownStyles from '../_components/format/Markdown';
import ActionButton, { FloatingButton } from '../_components/ui/Button';

export default function ChatScreen() {
  const drawerStatus = useDrawerStatus();
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState<string>('');
  const [isScreenTouched, setIsScreenTouched] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingText, setStreamingText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);
  const [typingAnim] = useState(new Animated.Value(0));
  const [streamingAnim] = useState(new Animated.Value(0));
  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [inputContainerPadding] = useState(new Animated.Value(16));
  const tabBarHeight = useTabBarHeight();
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Streaming control refs/state
  const cancelRef = useRef<{ current: boolean }>({ current: false });
  const [streamingIndex, setStreamingIndex] = useState<number>(0);
  const [responseText, setResponseText] = useState<string>('');
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    // For React Native, we'll use Alert for now since clipboard requires additional setup
    Alert.alert(
      "Copy Text",
      "Text copied to clipboard",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
    // In a real app, you'd use: Clipboard.setString(text);
    console.log("Text to copy:", text);
  };

  // Helper to build OpenAI messages array from local state
  function buildMessagesForAPI(messages: Array<{text: string, isUser: boolean}>, query?: string) {
    const systemPrompt = {
      role: 'system',
      content: `Format your response using these Markdown rules:\n1. **Bold** text with **double asterisks**\n2. *Italic* text with *single asterisks*\n3. Links with [visible text](url)\n4. Lists with - or * bullets\n5. Headers with # symbols\n6. Code blocks with \
\`\`\`\n7. Use markdown to format your response.\n8. Keep responses concise and mobile-friendly.\n9. Consider the user's theme and style when responding .`
    };
    const history = messages.map(m => ({
      role: m.isUser ? 'user' : 'assistant',
      content: m.text
    }));
    const arr = [systemPrompt, ...history];
    if (query !== undefined) arr.push({ role: 'user', content: query });
    return arr;
  }

  // Modify handleSend for streaming
const handleSend = async () => {
  if (query.trim()) {
    // If no conversationId, create a new conversation
    let convId = conversationId;
    if (!convId && user) {
      const conversation = await DatabaseService.addConversation(user.id, query.trim().slice(0, 32));
      if (conversation && conversation.id) {
        convId = conversation.id;
        setConversationId(convId);
      }
    }
    // Add user message to DB
    if (user && convId) {
      await DatabaseService.addMessage(user.id, query.trim(), 'user', convId);
    }
    const newMessage = { text: query, isUser: true };
    setMessages([...messages, newMessage]);
    setQuery('');
    Keyboard.dismiss();

    setIsScreenTouched(false);
    setIsStreaming(true);
    setStreamingText(''); // Reset for new response
    setStreamingIndex(0);
    setResponseText('');
    cancelRef.current.current = false;

    // Add empty AI message (will update dynamically)
    setMessages(prev => [...prev, { text: '', isUser: false }]);

    try {      
      // Build full conversation for API
      const apiMessages = buildMessagesForAPI([...messages, newMessage]);
      // Get the full response first
      const fullResponse = await getResponse(apiMessages);
      setResponseText(fullResponse);
      
      // Add assistant message to DB
      if (user && convId) {
        await DatabaseService.addMessage(user.id, fullResponse, 'assistant', convId);
      }

      // Now stream the response in chunks
      const words = fullResponse.split(' ');
      let currentWord = '';
      
      // Add initial delay to make typing indicator visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      for (let i = 0; i < words.length; i++) {
        if (cancelRef.current.current) {
          setStreamingIndex(i);
          return;
        }
        currentWord += (i > 0 ? ' ' : '') + words[i];
        setStreamingText(currentWord);
        // Update the last message (AI response)
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = currentWord;
          return updated;
        });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setStreamingIndex(words.length);
    } catch (error) {
      console.error('Streaming failed:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = "Sorry, I'm having trouble connecting. Please check your internet connection and API key.";
        return updated;
      });
    }
    finally{
      setIsStreaming(false);
    }
  }
};

const handleStopStreaming = () => {
  cancelRef.current.current = true;
  setIsStreamPaused(true)
  setIsStreaming(false);
};

const handleResumeStreaming = async () => {
  if (!responseText || streamingIndex >= responseText.split(' ').length) return;
  setIsStreaming(true);
  setIsStreamPaused(false);
  cancelRef.current.current = false;
  
  try {
    // Continue streaming from the stored full text (no new API call)
    const words = responseText.split(' ');
    let currentText = '';
    
    // Build the text from the beginning up to where we paused
    for (let i = 0; i < streamingIndex; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
    }
    
    // Now continue streaming from where we left off
    for (let i = streamingIndex; i < words.length; i++) {
      if (cancelRef.current.current) {
        setStreamingIndex(i);
        return;
      }
      currentText += (i > 0 ? ' ' : '') + words[i];
      setStreamingText(currentText);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = currentText;
        return updated;
      });
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setStreamingIndex(words.length);
  } catch (error) {
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1].text = "Sorry, I'm having trouble connecting. Please check your internet connection and API key.";
      return updated;
    });
  } finally {
    setIsStreaming(false);
  }
};


  useEffect(() => {
    if (!loading && user === null) {
      router.replace('/sign-in');
    }
  }, [user, loading]);


  useEffect(() => {
    // If chatId param is present, load that conversation's messages
    const chatId = params.chatId as string | undefined;
    if (chatId && user) {
      setConversationId(chatId);
      DatabaseService.getMessagesByConversationId(chatId).then(dbMessages => {
        // Convert DB messages to local format
        const formatted = dbMessages.map(m => ({ text: m.content, isUser: m.role === 'user' }));
        setMessages(formatted);
        // Scroll to bottom after loading messages
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      });
    }
  }, [params.chatId, user]);

  // Scroll to bottom on initial mount or when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length]);

  
  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', (e) => {
      const totalKeyboardHeight = e.endCoordinates.height - tabBarHeight;
      
      Animated.parallel([
        Animated.timing(keyboardHeight, {
          toValue: totalKeyboardHeight > 0 ? totalKeyboardHeight : 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(inputContainerPadding, {
          toValue: Platform.select({ ios: 0, android: 16 }) || 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        })
      ]).start();
    });

    const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', () => {
      Animated.parallel([
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(inputContainerPadding, {
          toValue: 16,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        })
      ]).start();
    });

    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, [tabBarHeight]);


  // Streaming text component with theme-aware styling
  const MessageBubble = ({ text}: { text: string}) => {
    return (
      <TouchableOpacity
        onLongPress={() => copyToClipboard(text)}
        activeOpacity={0.7}
        style={{ opacity: 1, borderRadius: 8 }}
      >
        <Animated.View style={{
          opacity: 1,
          borderRadius: 8,
        }}>
            <Markdown style={getMarkdownStyles(colors) as any}>
            {text}
            </Markdown>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handleChange = (text: string) => {
    setQuery(text);
  };

  const renderMessage = ({ item, index }: { item: { text: string, isUser: boolean }, index: number }) => (
    <View className={`mb-5 ${item.isUser ? 'ml-auto' : 'mr-auto'}`} style={{ maxWidth: 'auto' }}>
      {!item.isUser ? (
        <View className='flex-row items-start'>
          {/* <View className='mr-1'>
            <Image source={images.logo} style={{ width: 30, height: 30 }} />
          </View> */}
          <View style={{ backgroundColor: colors.background}} className='p-2 rounded-lg rounded-tl-none'>
            {isStreaming && index === messages.length - 1 && item.text === '' ? (
              <ActivityIndicator />
            ) : (
              <MessageBubble text={item.text} />
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onLongPress={() => copyToClipboard(item.text)}
          activeOpacity={1}
        >
          <View 
            className='p-3 rounded-lg rounded-tr-none'
            style={{ backgroundColor: colors.primary }}
          >
            <Text style={{ color: 'white' }}>{item.text}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
    

  const renderFooter = () => {
    if (!isLoading) return null;
    
    return (
      <View className='flex-row items-start mb-2 mr-auto max-w-[80%]'>
        <View className='mr-2'>
          <Image 
            source={images.logo} 
            style={{ width: 30, height: 30 }}
            className='rounded-full'
            contentFit='contain' 
          />
        </View>
        <View 
          className='p-3 rounded-lg rounded-tl-none'
          style={{ backgroundColor: colors.card }}
        >
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      </View>
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
      setIsScreenTouched(false);
      setIsAtBottom(true); // Hide the button immediately
    }
  };

  return (
    <Animated.View style={{ 
      flex: 1,
      paddingBottom: keyboardHeight,
      marginBottom: Platform.select({
        ios: 0,
        android: tabBarHeight // Only needed if Android doesn't handle it automatically
      })
    }}>
      <Pressable className='flex-1 h-full' onPress={dismissKeyboard}>
        <View className='flex-1' style={{ backgroundColor: drawerStatus === 'open' ? colors.border : colors.background}}>
          {/* Main Content */}
          {messages.length === 0 ? (
            <View className='flex-1 items-center justify-center'>
              <View className='flex-col items-center justify-center w-4/5'>
                <Image 
                  source={images.logo} 
                  style={{ width: 100, height: 100 }}
                  className='m-2 rounded-full'
                  contentFit='contain' 
                />
              </View>
              <Text className='text-sm m-1' style={{ color: colors.gray }}>
                Ask me anything...
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ padding: 16, paddingBottom: tabBarHeight ? tabBarHeight + 20 : 20 }}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={true}
              ListFooterComponent={renderFooter}
              windowSize={21}
              onScrollBeginDrag={() => {
                if (isStreaming) {
                  setIsScreenTouched(true);
                }
              }}
              onContentSizeChange={() => {
                if (isStreaming && messages.length > 0 && !isScreenTouched) {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }
              }}
              onScroll={(event) => {
                const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
                const paddingToBottom = 130;
                const isCloseToBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - paddingToBottom;
                setIsAtBottom(isCloseToBottom);
              }}
            />
          )}

          {/* Scroll to Bottom Button */}
          {!isAtBottom && (
            <FloatingButton 
              onPress={scrollToBottom}
              buttonImage="↓"
            />
          )}

          {/* Resume Button (floating) */}
          {isStreamPaused && streamingIndex > 0 && streamingIndex < (responseText.split(' ').length || 0) && (
            <FloatingButton 
              onPress={handleResumeStreaming}
              buttonImage="▶"
            />
          )}

          {/* Input Container */}
          
          <Animated.View 
            style={{ 
              padding: 16,
              marginBottom: 0,
              backgroundColor: colors.background 
            }}
          >
            <View 
              className='flex-col rounded-lg p-2 mt-0'
              style={{ backgroundColor: colors.border }}
            >
              <TextInput
                autoFocus={isFocused}
                placeholder= {drawerStatus === 'open' ? '': 'Message Qurius...'}
                className='p-2 w-full rounded-lg'
                placeholderTextColor={colors.gray}
                multiline={true}
                numberOfLines={4}
                style={{ color: colors.text }}
                onChangeText={handleChange}
                onSubmitEditing={handleSend}
                value={query}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!isLoading && !isStreaming}
              />
              <View className='flex-row items-center justify-end w-full mt-2'>
                  {isStreaming ? (
                    <ActionButton 
                      type='stop'
                      query={query}
                      isStreaming={isStreaming}
                      handleStopStreaming={handleStopStreaming}
                    />
                  ) : (
                    <ActionButton
                      type='send'
                      query={query}
                      isStreaming={isStreaming}
                      handleSend={handleSend}
                    />
                  )}
              </View>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}



