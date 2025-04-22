 /** @type {import('tailwindcss').Config} */
 export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {screens: {
      xs: "320px", // Add a new breakpoint for extra small screens
      sm: "640px", // Default small breakpoint
      md: "768px", // Default medium breakpoint
      lg: "1024px", // Default large breakpoint
      xl: "1280px", // Default extra-large breakpoint
      "2xl": "1536px", // Default 2x-large breakpoint
    },},
  },
  plugins: [],
}