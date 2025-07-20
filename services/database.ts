import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Message = Database['public']['Tables']['messages']['Row']

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

  static async addMessage(userId: string, content: string, role: 'user' | 'assistant'): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        content,
        role,
      })
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