/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        extend: {
            colors: {
              theme: {
                text: withOpacity("--color-text"),
                background: withOpacity("--color-background"),
                primary: withOpacity("--color-primary"),
                secondary: withOpacity("--color-secondary"),
                accent: withOpacity("--color-accent"),
              },
            },
          },
    },
  },
  // plugins: [require("@tailwindcss/typography")],
  plugins: [],
};