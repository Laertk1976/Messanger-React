import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@server': path.resolve(__dirname, 'server'),
    },
  },

  server: {
    proxy: {
      '/api': 'http://localhost:3003',
      '/socket.io': {
        target: 'http://localhost:3003',
        ws: true,
      },
    },
  },
});
