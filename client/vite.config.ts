import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // base: '/e-commerce',
  server: {
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
    outDir: "dist", // Fixed: should be relative to client directory
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Mobile optimizations
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    force: false,
    entries: ['src/main.jsx']
  },
  esbuild: {
    target: 'es2020',
    keepNames: false
  }
})
