import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      // optional options
      svgrOptions: {
        icon: true, // scales SVG to 1em, works well with MUI SvgIcon
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react")) {
            return "react";
          }
          if (id.includes("node_modules/@mui")) {
            return "mui";
          }
          if (id.includes("node_modules/@mui/icons-material")) {
            return "mui-icons";
          }
          if (id.includes("node_modules/maplibre-gl")) {
            return "maplibre";
          }
          if (id.includes("node_modules/zustand")) {
            return "zustand";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
