import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import { SUPABASE_CONFIG } from './config'

export const supabase = createClient(SUPABASE_CONFIG.projectUrl, SUPABASE_CONFIG.anonKey, {
  auth: {
    storage: {
      async getItem(key: string) {
        try {
          return await AsyncStorage.getItem(key)
        } catch (error) {
          console.error('Error getting item from storage:', error)
          return null
        }
      },
      async setItem(key: string, value: string) {
        try {
          await AsyncStorage.setItem(key, value)
        } catch (error) {
          console.error('Error setting item in storage:', error)
        }
      },
      async removeItem(key: string) {
        try {
          await AsyncStorage.removeItem(key)
        } catch (error) {
          console.error('Error removing item from storage:', error)
        }
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}) 