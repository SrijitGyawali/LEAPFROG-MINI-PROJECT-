/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "bg-yellow-50","text-yellow-700","border-yellow-200",
    "bg-blue-50","text-blue-700","border-blue-200",
    "bg-emerald-50","text-emerald-700","border-emerald-200",
    "bg-red-50","text-red-600","border-red-200",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Manrope", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#111111",
          active: "#242424",
          disabled: "#e5e7eb",
        },
        ink: "#111111",
        body: "#374151",
        muted: {
          DEFAULT: "#6b7280",
          soft: "#898989",
        },
        hairline: {
          DEFAULT: "#e5e7eb",
          soft: "#f3f4f6",
        },
        canvas: "#ffffff",
        surface: {
          soft: "#f8f9fa",
          card: "#f5f5f5",
          strong: "#e5e7eb",
          dark: "#101010",
          elevated: "#1a1a1a",
        },
        on: {
          primary: "#ffffff",
          dark: "#ffffff",
          "dark-soft": "#a1a1aa",
        },
        accent: "#3b82f6",
        badge: {
          orange: "#fb923c",
          pink: "#ec4899",
          violet: "#8b5cf6",
          emerald: "#34d399",
        },
      },
      letterSpacing: {
        "display-xl": "-0.05em",
        "display-lg": "-0.04em",
        "display-md": "-0.03em",
        "display-sm": "-0.02em",
        "display-xs": "-0.01em",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};
