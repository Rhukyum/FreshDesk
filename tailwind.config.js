/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Noob mode - light & friendly
        noob: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          accent: '#EFF6FF',
          text: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0'
        },
        // Expert mode - dark & professional
        expert: {
          bg: '#0F172A',
          surface: '#1E293B',
          'surface-hover': '#273548',
          panel: '#162032',
          terminal: '#0D0D0D',
          'terminal-text': '#4ADE80',
          text: '#E2E8F0',
          muted: '#94A3B8',
          border: '#334155',
          accent: '#3B82F6'
        },
        // Risk levels
        risk: {
          low: '#22C55E',
          medium: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444'
        }
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
