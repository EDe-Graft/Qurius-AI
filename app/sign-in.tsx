import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { images } from '../constants/images';
import { useTheme } from '../context/useThemeContext';
import { useAuth } from '../hooks/useAuth';
import { DatabaseService } from '../services/database';

export const options = {
  headerRight: () => {
    const { isDark, toggleTheme, colors } = useTheme();
    return (
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={24}
        color={colors.text}
        style={{ marginRight: 16 }}
        onPress={toggleTheme}
        accessibilityLabel="Toggle theme"
      />
    );
  },
};

export default function SignInScreen() {
  const { colors } = useTheme();
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    setError('');
    const { error } = await signIn(email.trim(), password);
    if (error) setError(error.message || 'Login failed');
    else router.replace('/');
    setSubmitting(false);
  };

  const handleSignup = async () => {
    setError('');
    setSuccess(false);
    if (password !== verifyPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    const { error, user } = await signUp(email.trim(), password);
    if (!error && user) {
      await DatabaseService.createProfile({
        id: user.id,
        email: user.email ?? '',
        full_name: '',
        avatar_url: ''
      });
    }
    if (error) setError(error.message || 'Sign up failed');
    else {
      setSuccess(true);
      router.replace('/');
    }
    setSubmitting(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="items-center mb-10">
          <Image source={images.logo} style={{ width: 80, height: 80, marginBottom: 16 }} />
          <Text className="text-2xl font-bold" style={{ color: colors.primary }}>{isNewUser ? 'Create Account' : 'Welcome Back'}</Text>
          <Text className="text-base mt-2" style={{ color: colors.gray }}>{isNewUser ? 'Sign up to get started' : 'Sign in to continue'}</Text>
        </View>
        <View className="w-full max-w-xs">
          <TextInput
            className="mb-4 px-4 py-3 rounded-lg border"
            style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
            placeholder="Email"
            placeholderTextColor={colors.gray}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="mb-2 px-4 py-3 rounded-lg border"
            style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
            placeholder="Password"
            placeholderTextColor={colors.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {isNewUser && (
            <TextInput
              className="mt-2 mb-2 px-4 py-3 rounded-lg border"
              style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
              placeholder="Verify Password"
              placeholderTextColor={colors.gray}
              secureTextEntry
              value={verifyPassword}
              onChangeText={setVerifyPassword}
            />
          )}
          {error ? (
            <Text className="mb-2 text-sm" style={{ color: '#ef4444' }}>{error}</Text>
          ) : null}
          {isNewUser && success ? (
            <Text className="mb-2 text-sm" style={{ color: colors.primary }}>
              Account created! Please check your email to verify your account.
            </Text>
          ) : null}
          <TouchableOpacity
            className="mt-2 py-3 rounded-lg items-center"
            style={{ backgroundColor: colors.primary, opacity: submitting ? 0.7 : 1 }}
            onPress={isNewUser ? handleSignup : handleLogin}
            disabled={submitting || !email || !password || (isNewUser && !verifyPassword)}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-base" style={{ color: colors.background }}>{isNewUser ? 'Sign Up' : 'Sign In'}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity className="mt-4 items-center" onPress={() => { setIsNewUser(!isNewUser); setError(''); setSuccess(false); }}>
            <Text style={{ color: colors.primary }}>
              {isNewUser ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
} 