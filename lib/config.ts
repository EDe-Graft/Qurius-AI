// Supabase Configuration
// Replace these with your actual Supabase project credentials
export const SUPABASE_CONFIG = {
  projectUrl: process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL || '',
  apiKey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY || '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
}

//Open AI config
export const OPEN_AI_CONFIG = {
    apiUrl: process.env.EXPO_PUBLIC_OPENAI_API_URL || 'https://openrouter.ai/api/v1',
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'https://localhost:8081'
}

