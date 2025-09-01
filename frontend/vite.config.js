import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // More specific checks first
          if (id.includes('node_modules/@mui/icons-material')) {
            return 'mui-icons';
          }
          if (id.includes('node_modules/@mui')) {
            return 'mui';
          }
          if (id.includes('node_modules/react')) {
            return 'react';
          }
          if (id.includes('node_modules/maplibre-gl')) {
            return 'maplibre';
          }
          if (id.includes('node_modules/zustand')) {
            return 'zustand';
          }
          // General catch-all for other vendors
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@mui/icons-material', '@emotion/react', '@emotion/styled'],
  },
});
