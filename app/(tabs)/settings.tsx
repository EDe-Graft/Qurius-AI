import { useTheme } from '@/context/useThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    DatabaseService.getProfile(user.id).then((data) => {
      setProfile(data);
      setFullName(data?.full_name || '');
      setAvatarUrl(data?.avatar_url || '');
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const updated = await DatabaseService.updateProfile(user.id, { full_name: fullName, avatar_url: avatarUrl });
    setProfile(updated);
    setEditing(false);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleClearHistory = async () => {
    if (!user) return;
    Alert.alert('Clear Chat History', 'Are you sure you want to delete all your chat history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await DatabaseService.deleteMessages(user.id);
        Alert.alert('Chat history cleared');
      }},
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 px-6 py-8" style={{ backgroundColor: colors.background }}>
      {/* Profile Section */}
      <View className="items-center mb-8">
        <View style={{ borderRadius: 48, overflow: 'hidden', borderWidth: 2, borderColor: colors.primary, marginBottom: 12 }}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={{ width: 96, height: 96 }} />
          ) : (
            <Ionicons name="person-circle" size={96} color={colors.gray} />
          )}
        </View>
        {editing ? (
          <>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              placeholder="Full Name"
              placeholderTextColor={colors.gray}
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              placeholder="Avatar URL"
              placeholderTextColor={colors.gray}
              value={avatarUrl}
              onChangeText={setAvatarUrl}
            />
            <View className="flex-row mt-2">
              <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]} disabled={saving}>
                <Text style={{ color: colors.background, fontWeight: 'bold' }}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditing(false)} style={[styles.cancelBtn, { borderColor: colors.primary }]}> 
                <Text style={{ color: colors.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.name, { color: colors.text }]}>{profile?.full_name || 'No Name'}</Text>
            <Text style={[styles.email, { color: colors.gray }]}>{profile?.email}</Text>
            <TouchableOpacity onPress={() => setEditing(true)} style={[styles.editBtn, { borderColor: colors.primary }]}> 
              <Ionicons name="pencil" size={16} color={colors.primary} />
              <Text style={{ color: colors.primary, marginLeft: 4 }}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Settings Section */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={isDark ? colors.primary : colors.gray}
          />
        </View>
        {/* Add more settings here if needed */}
      </View>

      {/* Actions Section */}
      <View>
        <TouchableOpacity onPress={handleClearHistory} style={[styles.actionBtn, { backgroundColor: colors.card }]}> 
          <Ionicons name="trash" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, marginLeft: 8 }}>Clear Chat History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={[styles.actionBtn, { backgroundColor: colors.card, marginTop: 12 }]}> 
          <Ionicons name="log-out" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, marginLeft: 8 }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  email: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    width: 240,
    alignSelf: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
    marginTop: 6,
  },
  saveBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  settingText: {
    fontSize: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
});