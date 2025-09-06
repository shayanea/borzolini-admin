/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary Colors from Design Spec
        primary: {
          dark: '#000000',
          navy: '#023e8a',
          orange: '#fca311',
          light: '#e5e5e5',
          white: '#ffffff',
        },
        // Semantic Colors
        text: {
          primary: '#023e8a',
          secondary: '#000000',
          light: '#6b7280',
        },
        // UI Component Colors
        background: '#ffffff',
        foreground: '#023e8a',
        'background-secondary': '#f9fafb',
        'background-accent': '#fff7ed',
        // Interactive Elements
        button: {
          primary: '#023e8a',
          secondary: '#fca311',
          accent: '#000000',
        },
        // Health Status Colors
        health: {
          excellent: '#059669',
          good: '#fca311',
          warning: '#dc2626',
        },
        // AI/Tech Specific
        ai: {
          primary: '#023e8a',
          accent: '#fca311',
          background: '#f0f4f8',
        },
        // Admin Panel Specific Colors
        admin: {
          sidebar: '#1f2937',
          'sidebar-hover': '#374151',
          'sidebar-active': '#3b82f6',
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
      },
    },
  },
  plugins: [],
};
