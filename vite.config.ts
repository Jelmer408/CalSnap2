import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: "Calorie Tracker",
        short_name: "Calories",
        description: "Track your daily calorie intake",
        start_url: "/",
        display: "standalone",
        background_color: "#111827",
        theme_color: "#111827",
        icons: [
          {
            src: "/icon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
});
