/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "login-bg": "url('./src/assets/background.webp')",
      },
    },
  },
  plugins: [],
};
