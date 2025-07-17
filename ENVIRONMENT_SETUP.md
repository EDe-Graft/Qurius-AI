# Environment Setup Guide

## Required Environment Variables

To fix the network error, you need to set up your environment variables. Create a `.env` file in your project root with the following variables:

```env
# OpenAI API Configuration
# Get your API key from: https://openrouter.ai/keys
EXPO_PUBLIC_OPENAI_API_KEY=your_openrouter_api_key_here

# API URL (defaults to OpenRouter if not set)
EXPO_PUBLIC_OPENAI_API_URL=https://openrouter.ai/api/v1

# Backend URL (for referer header)
EXPO_PUBLIC_BACKEND_URL=https://localhost:8081
```

## Steps to Get Your API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key and paste it in your `.env` file

## Testing the Connection

The app now includes a test function. You can test the connection by:

1. Opening your app
2. Opening the developer console
3. Running: `testConnection()` in the console

## Troubleshooting

### Common Issues:

1. **"API key not found"** - Make sure your `.env` file is in the project root and contains the correct variable name
2. **"Network error"** - Check your internet connection
3. **"401 Unauthorized"** - Your API key is invalid or expired
4. **"403 Forbidden"** - Check your OpenRouter account status

### For React Native Development:

Make sure to restart your development server after adding the `.env` file:

```bash
npx expo start --clear
```

## Notes

- The app will now try streaming first, then fall back to non-streaming if there are issues
- Better error messages will help you identify the specific problem
- The API key is required for the app to function 