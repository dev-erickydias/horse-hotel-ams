/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefdfb',
          100: '#faf8f4',
          200: '#f5f0e8',
          300: '#ede5d8',
          400: '#ddd2c0',
          500: '#c4b49c',
        },
        forest: {
          50: '#f0f5f1',
          100: '#dce8de',
          200: '#b8d1bc',
          300: '#8fb896',
          400: '#5e9466',
          500: '#3d7a47',
          600: '#2d6237',
          700: '#1f4d29',
          800: '#183d20',
          900: '#0f2914',
          950: '#091a0d',
        },
        gold: {
          50: '#fdf9f0',
          100: '#f9f0d8',
          200: '#f2deb0',
          300: '#e9c77e',
          400: '#d4a44e',
          500: '#c8964e',
          600: '#b07a34',
          700: '#93612c',
          800: '#7a4e29',
          900: '#654025',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
