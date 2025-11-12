/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary Colors from Design Spec
        primary: {
          dark: '#0b1220',
          navy: '#1e1b4b',
          orange: '#f59e0b',
          light: '#eef2ff',
          white: '#ffffff',
          gradientFrom: '#6ecefd',
          gradientTo: '#06b6d4',
        },
        // Semantic Colors
        text: {
          primary: '#0f172a',
          secondary: '#334155',
          light: '#94a3b8',
        },
        // UI Component Colors
        background: '#ffffff',
        foreground: '#111827',
        'background-secondary': '#f8fafc',
        'background-accent': '#eef2ff',
        // Interactive Elements
        button: {
          primary: '#6ecefd',
          secondary: '#06b6d4',
          accent: '#0ea5e9',
        },
        // Health Status Colors
        health: {
          excellent: '#10b981',
          good: '#f59e0b',
          warning: '#ef4444',
        },
        // AI/Tech Specific
        ai: {
          primary: '#6ecefd',
          accent: '#06b6d4',
          background: '#f1f5f9',
        },
        // Admin Panel Specific Colors
        admin: {
          sidebar: '#0b1220',
          'sidebar-hover': '#111827',
          'sidebar-active': '#6ecefd',
          header: '#ffffff',
          'header-border': '#e5e7eb',
          card: '#ffffff',
          'card-border': '#e5e7eb',
          'card-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      boxShadow: {
        'admin-card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'admin-sidebar': '2px 0 8px 0 rgba(0, 0, 0, 0.1)',
        'admin-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 8px 24px 0 rgba(0, 0, 0, 0.1)',
        'gradient': '0 4px 20px rgba(102, 126, 234, 0.15)',
      },
    },
  },
  plugins: [],
};
