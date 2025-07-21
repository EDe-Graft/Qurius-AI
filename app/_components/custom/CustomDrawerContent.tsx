import { images } from '@/constants/images';
import { useTheme } from '@/context/useThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type Conversation = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

export default function CustomDrawerContent(props: { navigation: any }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigation = props.navigation;
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      DatabaseService.getConversations(user.id, 50).then(setConversations);
    }
  }, [user]);

  // Filter conversations by search
  const filtered = conversations.filter(c => (c.title || '').toLowerCase().includes(search.toLowerCase()));

  if (!user) {
    return (
      <DrawerContentScrollView style={{ backgroundColor: colors.background }}>
        <View style={{ padding: 16, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Not signed in</Text>
          <Text style={{ color: colors.gray, marginBottom: 24, textAlign: 'center' }}>
            Please sign in to access your chats and settings.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/sign-in')}
            style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }}
          >
            <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    );
  }

  // Handler for new chat
  const handleNewChat = async () => {
    if (!user) return;
    setCreating(true);
    const conversation = await DatabaseService.addConversation(user.id, 'New Chat');
    setCreating(false);
    if (conversation && conversation.id) {
      navigation.closeDrawer();
      router.replace({ pathname: '/', params: { chatId: conversation.id } });
      // Optionally refresh conversations
      DatabaseService.getConversations(user.id, 50).then(setConversations);
    }
  };

  // Handler for sign out
  const handleSignOut = async () => {
    await signOut();
    navigation.closeDrawer();
    router.replace('/sign-in');
  };

  return (
    <DrawerContentScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <View style={{ padding: 16 }}>
        {/* App Logo */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image source={images.logo} style={{ width: 64, height: 64, marginBottom: 8 }} />
        </View>
        <TextInput
          placeholder="Search chats..."
          placeholderTextColor={colors.gray}
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: colors.card,
            color: colors.text,
            borderRadius: 8,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        />
        {/* New Chat Button */}
        <TouchableOpacity
          onPress={handleNewChat}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingVertical: 8,
            alignItems: 'center',
            marginBottom: 16,
            opacity: creating ? 0.7 : 1,
          }}
          disabled={creating}
        >
          <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 16 }}>+ New Chat</Text>
        </TouchableOpacity>
        {/* Tabs Section */}
        <Text className='mb-2' style={{ color: colors.gray, fontWeight: 'bold' }}>Tabs</Text>
        <TouchableOpacity onPress={() => { router.replace('/'); navigation.closeDrawer(); }} style={styles.link(colors)}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.replace('/settings'); navigation.closeDrawer(); }} style={styles.link(colors)}>
          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Settings</Text>
        </TouchableOpacity>
        {/* Conversation Titles */}
        <Text style={{ color: colors.gray, fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>Conversations</Text>
        {filtered.length === 0 && (
          <Text style={{ color: colors.gray, fontStyle: 'italic' }}>No conversations found.</Text>
        )}
        {filtered.map((conv, idx) => (
          <View key={conv.id || idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              className='mb-1'
              onPress={() => {
                router.replace({ pathname: '/', params: { chatId: conv.id } });
                navigation.closeDrawer();
              }}
              style={[styles.chatTitle(colors), { flex: 1, flexDirection: 'row', alignItems: 'center' }]}
            >
              <Text className='p-1' style={{ color: colors.text, flex: 1 }}>{conv.title || 'Untitled'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async (e) => {
                e.stopPropagation && e.stopPropagation();
                await DatabaseService.deleteConversation(conv.id);
                // Refresh conversations
                if (user) {
                  const updated = await DatabaseService.getConversations(user.id, 50);
                  setConversations(updated);
                }
              }}
              style={{ marginLeft: 8, padding: 6, borderRadius: 16, backgroundColor: colors.card }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {/* Sign Out Button at the bottom */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: colors.card,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.primary,
          }}
        >
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  link: (colors: any) => ({
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    marginBottom: 4,
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chatTitle: (colors: any) => ({
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: colors.card,
    marginBottom: 10,
  }),
};
