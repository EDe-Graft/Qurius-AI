# <img src="./assets/readme-icons/qurius-animated.gif" alt="Qurius ChatBot" width="48" style="vertical-align:middle;"/> Qurius ChatBot 🤖

A beautiful, blazing-fast, mobile-first AI chatbot app built with React Native and Expo.

---

<div align="center">
  <img src="./screenshots/1.png" alt="ChatBot Home" width="250"/>
  <img src="./screenshots/2.png" alt="Chat Conversation" width="250"/>
  <img src="./screenshots/3.png" alt="Dark Mode" width="250"/>
  <!-- Add more screenshots as needed -->
</div>

---

## ✨ Features

- **Conversational AI**: Chat with an intelligent assistant powered by OpenAI's GPT models.
- **Markdown Support**: AI responses are beautifully formatted with Markdown (code, lists, links, etc.).
- **Streaming Responses**: Watch the AI type out its answers in real time, just like a real conversation.
- **Copy on Long Press**: Long-press any message (AI or user) to copy its text instantly.
- **Theme Awareness**: Fully supports light and dark mode, adapting to your device's theme.
- **Mobile-First UI**: Designed for a seamless, modern mobile experience with smooth animations and intuitive gestures.
- **Persistent Chat History**: (Optional) Easily extend to store and retrieve past conversations.

---

## 🛠️ Tools & Technologies

<div align="center">
  <img src="./assets/readme-icons/react-native.png" alt="React Native" width="40" title="React Native"/>
  <img src="./assets/readme-icons/expo.png" alt="Expo" width="40" title="Expo"/>
  <img src="./assets/readme-icons/typescript.png" alt="TypeScript" width="40" title="TypeScript"/>
  <img src="./assets/readme-icons/openai.png" alt="OpenAI" width="40" title="OpenAI API"/>
  <img src="./assets/readme-icons/markdown.png" alt="Markdown" width="40" title="Markdown Display"/>
  <img src="./assets/readme-icons/tailwind.png" alt="NativeWind" width="40" title="NativeWind (Tailwind CSS for RN)"/>
  <img src="./assets/readme-icons/expo-router.png" alt="Expo Router" width="40" title="Expo Router"/>
  <img src="./assets/readme-icons/clipboard.png" alt="Clipboard API" width="40" title="Clipboard API"/>
  <img src="./assets/readme-icons/github.png" alt="GitHub" width="40" title="GitHub"/>
</div>

- **React Native** (with Expo) — cross-platform mobile development
- **TypeScript** — type safety and maintainability
- **OpenAI API** — natural language understanding and generation
- **react-native-markdown-display** — rich markdown rendering
- **NativeWind (Tailwind CSS for RN)** — rapid, consistent styling
- **Expo Router** — file-based navigation
- **Custom Hooks & Context** — for theme and tab bar management
- **Clipboard API** — (optional) for copy-to-clipboard functionality

---

## 🚀 Strategies & Design Decisions

- **Streaming UI**: Implemented a word-by-word streaming effect for AI responses, creating a natural, engaging chat experience.
- **Touch-Optimized**: All message bubbles are touchable, supporting long-press copy and smooth scrolling.
- **Keyboard Handling**: Animated keyboard-aware input ensures the chat input is always accessible, even with the keyboard open.
- **Separation of Concerns**: Cleanly separated UI, logic, and API calls for maintainability and scalability.
- **Theme Context**: Centralized theme management for instant light/dark mode switching and consistent color usage.
- **Error Handling**: Graceful error messages for network/API issues, ensuring a robust user experience.

---

## 🧩 Problems Solved

- **Non-selectable Markdown**: Added long-press copy for both AI and user messages to work around React Native's markdown selection limitations.
- **Overlapping Bubbles**: Refactored message rendering to prevent AI bubbles from overlapping user messages.
- **Keyboard Overlap**: Used animated views and tab bar height detection to keep the input field visible at all times.
- **Consistent Theming**: Unified color palette and context-driven theming for a polished, professional look.

---

## 📸 Screenshots

<!-- Replace these with your actual screenshots -->

<div align="center">
  <img src="./assets/images/loading-screen.jpeg" alt="Loading Screen" width="250"/>
  <img src="./assets/images/chat-conversation.png" alt="Chat Conversation Dark Mode" width="250"/>
  <img src="./assets/images/dark-mode-settings.png" alt="Dark Mode Settings" width="250"/>
  <img src="./assets/images/copy-feature.png" alt="Copy Feature" width="250"/>
</div>

---

## 🏁 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the app**
   ```bash
   npx expo start
   ```
3. **Open on your device**
   - Use the Expo Go app, an emulator, or a development build.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📄 License

[MIT](./LICENSE)

---

> _Built using React Native, Expo, and OpenAI._
