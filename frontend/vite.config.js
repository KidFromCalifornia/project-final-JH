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
});
