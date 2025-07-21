import { OPEN_AI_CONFIG } from '@/lib/config';
import axios from 'axios';

// Default values if environment variables are not set
const API_URL = OPEN_AI_CONFIG.apiUrl;
const API_KEY = OPEN_AI_CONFIG.apiKey;
const BACKEND_URL = OPEN_AI_CONFIG.backendUrl;


// Non-streaming version
export const getResponse = async (messages: Array<{ role: string; content: string }>): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error('API key not found. Please set EXPO_PUBLIC_OPENAI_API_KEY in your environment variables.');
    }

    const response = await axios.post(`${API_URL}/chat/completions`, {
      model: "qwen/qwq-32b:free",
      messages,
      stream: false,
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': BACKEND_URL,
        'X-Title': 'Qurius',
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    return response.data.choices[0]?.message?.content || "No response received.";
  } catch (error: any) {
    console.error('Open API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.status, error.response.data);
      return `Error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown server error'}`;
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
      return "Network error: Please check your internet connection and try again.";
    } else {
      // Other error
      console.error('Other error:', error.message);
      return `Error: ${error.message}`;
    }
  }
};



// import OpenAI from 'openai';

// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": "https://localhost:8081",
//     "X-Title": "Qurius",
//   },
// });

// export const getResponse = async (query: string) => {
//   try {
//     const result = await openai.chat.completions.create({
//       model: "deepseek/deepseek-chat-v3-0324:free",
//       messages: [
//         {
//           role: "system",
//           content: "Format your response using these Markdown rules:\n" +
//                    "1. **Bold** text with **double asterisks**\n" +
//                    "2. *Italic* text with *single asterisks*\n" +
//                    "3. Links with [visible text](url)\n" +
//                    "4. Lists with - or * bullets\n" +
//                    "5. Headers with # symbols\n" +
//                    "6. Code blocks with ```\n" +
//                    "7. Use markdown to format your response.\n" +
//                    "8. Keep responses concise and mobile-friendly.\n" +
//                    "9. Consider the user's theme and style when responding."
//         },
//         {
//           role: "user",
//           content: query
//         }
//       ],
//     });
    
//     // Return raw Markdown to be rendered by react-native-markdown-display
//     return result.choices[0].message.content;
//   } catch (error) {
//     console.log(error);
//     return "Sorry, I encountered an error. Please try again.";
//   }
// };

