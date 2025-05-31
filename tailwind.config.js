module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'brand-purple-dark': '#0F172A', 
        'brand-purple': '#1E293B',    
        'brand-purple-light': '#334155', 
        'accent-blue': '#00A9FF',
        'accent-magenta': '#FF00FF',
        'accent-teal': '#00FFC6',
        'light-bg': '#F5F3FF', 
        'dark-text': '#E2E8F0',   
        'light-text': '#1A0B2E',  
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], 
      },
      boxShadow: {
        'glow-blue': '0 0 15px 5px rgba(0, 169, 255, 0.5)',
        'glow-magenta': '0 0 15px 5px rgba(255, 0, 255, 0.5)',
        'glow-teal': '0 0 15px 5px rgba(0, 255, 198, 0.5)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
        fadeInUp: 'fadeInUp 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-purple-dark': 'linear-gradient(145deg, #0F172A, #1E293B)', 
        'gradient-accent': 'linear-gradient(45deg, #00A9FF, #FF00FF, #00FFC6)',
        
        'gradient-subtle-dark': 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(30, 41, 59, 0.3) 100%)',
        'gradient-subtle-light': 'linear-gradient(180deg, rgba(245, 243, 255, 0.1) 0%, rgba(230, 220, 255, 0.3) 100%)',
      }
    },
  },
  plugins: [],
}