import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0e17',
        card: '#111726',
        'card-hover': '#182035',
        border: 'rgba(0, 217, 255, 0.15)',
        cyan: {
          400: '#38bdf8',
          500: '#00d9ff',
          600: '#0284c7',
          glow: 'rgba(0, 217, 255, 0.3)',
        },
        status: {
          good: '#10b981',
          warning: '#f59e0b',
          critical: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 217, 255, 0.35)',
        'red-glow': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'green-glow': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scanLine 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 217, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
