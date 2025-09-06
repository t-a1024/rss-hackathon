/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          "slide-up-fade": {
            "0%":   { opacity: "0", transform: "translateY(16px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
        },
        animation: {
          "slide-up-fade": "slide-up-fade 500ms ease-out both",
        },
      },
    },
    plugins: [],
  }
  