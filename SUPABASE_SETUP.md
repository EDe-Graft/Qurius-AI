# Supabase Setup Guide

This guide will help you set up Supabase with your React Native ChatBot application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your React Native project ready

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `chatbot-app` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 3: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy your Project URL and anon/public key
3. Create a `.env` file in your project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click "Run" to execute the migration

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure your site URL (for development, use `http://localhost:3000`)
3. Add redirect URLs if needed

## Step 6: Test the Integration

You can now use the provided hooks and services:

```typescript
import { useAuth } from '../hooks/useAuth'
import { DatabaseService } from '../services/database'

// In your component
const { user, signIn, signUp, signOut } = useAuth()

// Example usage
const handleSignIn = async () => {
  const { error } = await signIn('user@example.com', 'password')
  if (error) console.error('Sign in error:', error)
}
```

## File Structure

```
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── config.ts            # Environment configuration
├── hooks/
│   └── useAuth.ts           # Authentication hook
├── services/
│   └── database.ts          # Database operations
├── types/
│   └── database.ts          # TypeScript types
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Database schema
```

## Features Included

- ✅ User authentication (sign up, sign in, sign out)
- ✅ User profiles management
- ✅ Message storage and retrieval
- ✅ Row Level Security (RLS) policies
- ✅ TypeScript support
- ✅ Real-time authentication state
- ✅ Secure session management

## Next Steps

1. Implement secure storage for production (consider using `expo-secure-store`)
2. Add real-time subscriptions for live chat features
3. Implement file uploads for avatars
4. Add push notifications
5. Set up email templates in Supabase dashboard

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure your `.env` file is in the project root
2. **Authentication errors**: Check your Supabase URL and anon key
3. **Database errors**: Ensure the migration has been run successfully
4. **TypeScript errors**: Make sure all types are properly imported

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [React Native + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Supabase Discord](https://discord.supabase.com) 