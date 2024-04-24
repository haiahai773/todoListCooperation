/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                "box-sm": "1px 1px 24px 5px #ccc",
                "box-lg": "1px 1px 64px 5px #ccc",
            },
            backgroundImage: {
                "login-bg": "url('./src/assets/background.webp')",
                logo: "url('./scr/assets/logo.webp')",
            },
        },
    },
    plugins: [],
};
