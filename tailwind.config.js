/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* === New BillWise palette (2025-06) === */
        charcoal: "#264653", // dark text / header bg
        persian: "#2a9d8f", // primary interactive colour
        saffron: "#e9c46a", // highlight / warning
        sandy: "#f4a261",   // secondary buttons / info
        sienna: "#e76f51",  // danger / brand accent

        /* Semantic aliases (keep existing class names working) */
        primary: "#2a9d8f",   // mapped to persian green
        secondary: "#f4a261", // sandy-brown
        accent: "#e76f51",    // burnt-sienna
        surface: "#fffaf3",   // very light neutral background
        textdark: "#264653",  // charcoal
        brandHeader: "#2a9d8f", /* header bg uses primary */


      },


      backgroundImage: {
        "radial-cream": "radial-gradient(circle at top left, #fffaf3 0%, #ffffff 100%)",
        "gradient-brand": "linear-gradient(135deg, #2a9d8f 0%, #e9c46a 50%, #e76f51 100%)",
      },
    },
  },
  plugins: [],
};
