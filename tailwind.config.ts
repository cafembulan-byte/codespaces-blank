import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#f8f4ef',
          100: '#f2e9e0',
          200: '#e5d0bb',
          300: '#d6b393',
          400: '#b88a63',
          500: '#9a673f',
          600: '#7d4f2f',
          700: '#5f3a24',
          800: '#422816',
          900: '#2a1a0f',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(55, 37, 17, 0.18)',
      },
    },
  },
  plugins: [],
}

export default config
