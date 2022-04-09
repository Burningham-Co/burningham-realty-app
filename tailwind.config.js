const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      main: ["Montserrat", "sans-serif"],
    },
    extend: {},
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        "#root": {
          height: "100vh",
          fontFamily: "'Montserrat', sans-serif",
        },
        ".link": {
          cursor: "pointer",
          "&:hover": {
            fontWeight: "900",
          },
        },
        ".btn": {
          color: "#fff",
          backgroundColor: "#A21D21",
          padding: "0.5rem",
          borderRadius: "0.75rem",
          textAlign: "center",
          transition: "all 0.5s",
          "&:hover": {
            backgroundColor: "#7B1518",
          },
          "&:disabled": {
            opacity: "0.3",
          },
        },
        ".input-box": {
          marginBottom: "15px",
          width: "calc(100% / 2 - 20px)",
          "@media (max-width: 640px)": {
            marginBottom: "15px",
            width: "100%",
          },
        },
        ".details": {
          display: "block",
          fontWeight: "600",
          marginBottom: "5px",
        },
        input: {
          width: "100%",
          height: "45px",
          outline: "none",
          borderRadius: "5px",
          border: "1px solid #ccc",
          paddingLeft: "15px",
          fontSize: "16px",
          borderBottomWidth: "2px",
          transition: "all 0.3s ease",
          "&:focus": {
            borderColor: "#A21D21",
          },
          "&:valid": {
            borderColor: "#A21D21",
          },
          "&:disabled": {
            borderColor: "#a3a3a3",
            borderWidth: "2px",
            backgroundColor: "#e4e4e7",
          },
        },
        select: {
          width: "100%",
          height: "45px",
          outline: "none",
          borderRadius: "5px",
          border: "1px solid #ccc",
          paddingLeft: "15px",
          fontSize: "16px",
          borderBottomWidth: "2px",
          transition: "all 0.3s ease",
          "&:focus": {
            borderColor: "#A21D21",
          },
          "&:valid": {
            borderColor: "#A21D21",
          },
        },
      });
    }),
  ],
};
