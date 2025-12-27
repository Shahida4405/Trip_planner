/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ✅ Extra breakpoints
      screens: {
        xxsm: "332px",
        xsm: "432px",
        xlplus: "1400px",
      },

      // ✅ Custom colors
      colors: {
        brand: {
          DEFAULT: "#EB662B",
          light: "#FF8A50",
          dark: "#C44E1A",
        },
        accent: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1E40AF",
        },
        neutral: {
          DEFAULT: "#1F2937",
          light: "#4B5563",
          lighter: "#9CA3AF",
        },
      },

      // ✅ Fonts
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },

      // ✅ Shadows
      boxShadow: {
        smooth: "0 4px 12px rgba(0,0,0,0.1)",
        "brand-glow": "0 0 20px rgba(235, 102, 43, 0.6)",
      },

      // ✅ Gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand":
          "linear-gradient(135deg, #EB662B 0%, #FF8A50 100%)",
        "gradient-accent":
          "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
      },

      // ✅ Animations
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
