/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // iOS System Colors
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          red: '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          purple: '#AF52DE',
          pink: '#FF2D55',
          teal: '#5AC8FA',
          indigo: '#5856D6',
        },
        // Light theme
        light: {
          bg: '#F2F2F7',
          card: 'rgba(255, 255, 255, 0.8)',
          text: '#1C1C1E',
          'text-secondary': '#8E8E93',
          border: 'rgba(60, 60, 67, 0.1)',
          separator: 'rgba(60, 60, 67, 0.36)',
        },
        // Dark theme
        dark: {
          bg: '#000000',
          card: 'rgba(28, 28, 30, 0.8)',
          text: '#FFFFFF',
          'text-secondary': '#8E8E93',
          border: 'rgba(84, 84, 88, 0.65)',
          separator: 'rgba(84, 84, 88, 0.65)',
        },
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-2xl': '24px',
      },
      boxShadow: {
        'ios': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'ios-xl': '0 8px 30px rgba(0, 0, 0, 0.16)',
      },
      backdropBlur: {
        'ios': '20px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
