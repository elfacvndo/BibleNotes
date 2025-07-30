/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          light: '#3b82f6',
          dark: '#1e3a8a',
        },
        secondary: '#059669',
        accent: '#d97706',
        background: '#f8fafc',
        surface: '#ffffff',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        error: '#dc2626',
        warning: '#f59e0b',
        success: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Georgia', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
