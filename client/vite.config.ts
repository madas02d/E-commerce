import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // base: '/e-commerce',
  server: {
    proxy: {
      '/api': 'http://localhost:5173/products'
    },
    port: 5173,
    strictPort: false, // Allow fallback ports
    hmr: {
      overlay: false,
      port: 5173
    },
    watch: {
      usePolling: false,
      interval: 1000 // Increased interval to reduce CPU usage
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    force: false,
    entries: ['src/main.jsx']
  },
  esbuild: {
    target: 'es2020',
    minify: 'terser',
    keepNames: false
  }
})