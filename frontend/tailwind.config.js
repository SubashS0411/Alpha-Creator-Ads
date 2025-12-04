/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'instagram-blue': '#0095f6',
        'instagram-gray': '#8e8e8e',
        'instagram-light-gray': '#fafafa',
        'instagram-border': '#dbdbdb',
        'youtube-red': '#FF0000',
        'youtube-dark': '#0f0f0f',
        'youtube-light-gray': '#f9f9f9',
      },
      fontFamily: {
        'instagram': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}