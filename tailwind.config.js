/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx","./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#f5f5f5',
        secondaryLight: '#9333EA',
        tertiary: '#03dac6',
        quaternary: '#bb86fc',
        quinary: '#000000',
        senary: '#ffffff',
        septenary: '#888888',
      },
    },
  },
  plugins: [],
}