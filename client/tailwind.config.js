/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],

  daisyui: {
    themes: [
      "light",
      "dark",
      {
        premium: {
          "primary": "#4f46e5", // Indigo 600
          "secondary": "#334155", // Slate 700
          "accent": "#3b82f6", // Blue 500
          "neutral": "#1e293b", // Slate 800
          "base-100": "#ffffff",
          "base-200": "#f8fafc", // Slate 50
          "base-300": "#f1f5f9", // Slate 100
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      },
    ],
  }
}

