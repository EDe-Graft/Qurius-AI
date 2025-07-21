import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Message = Database['public']['Tables']['messages']['Row']
type Conversation = Database['public']['Tables']['conversations']['Row']

export class DatabaseService {
  // Profile operations
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return null
    }

    return data
  }

  static async createProfile(profile: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }
    return data;
  }

  // Conversation operations
  static async addConversation(userId: string, title: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title })
      .select()
      .single();
    if (error) {
      console.error('Error adding conversation:', error)
      return null
    }
    return data;
  }

  static async deleteConversation(conversationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);
    if (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
    return true;
  }

  static async getConversations(userId: string, limit = 50): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
    return data || [];
  }

  // Message operations
  static async getMessages(userId: string, limit = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return data || []
  }

  static async getMessagesByConversationId(conversationId: string, limit = 100): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) {
      console.error('Error fetching messages by conversation:', error);
      return [];
    }
    return data || [];
  }

  static async addMessage(userId: string, content: string, role: 'user' | 'assistant', conversationId?: string): Promise<Message | null> {
    const insertObj: any = { user_id: userId, content, role };
    if (conversationId) insertObj.conversation_id = conversationId;
    const { data, error } = await supabase
      .from('messages')
      .insert(insertObj)
      .select()
      .single()

    if (error) {
      console.error('Error adding message:', error)
      return null
    }

    return data
  }

  static async deleteMessages(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting messages:', error)
      return false
    }

    return true
  }
} 