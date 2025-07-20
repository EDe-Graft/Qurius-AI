// Supabase Configuration
// Replace these with your actual Supabase project credentials
export const SUPABASE_CONFIG = {
  projectUrl: process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL || 'your_supabase_project_url',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key',
}

//Open AI config
export const OPEN_AI_CONFIG = {
    apiUrl: process.env.EXPO_PUBLIC_OPENAI_API_URL || 'https://openrouter.ai/api/v1',
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'https://localhost:8081'
}

// Instructions:
// 1. Create a .env file in your project root
// 2. Add your Supabase credentials:
//    EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
//    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key 