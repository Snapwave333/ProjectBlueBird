import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#36BCF7',
        secondary: '#F7B536',
        background: '#1a202c',
        surface: '#2d3748',
        text: '#ffffff',
      },
      fontFamily: {
        sans: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
