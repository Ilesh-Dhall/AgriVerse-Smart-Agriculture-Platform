import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/webhook-test': {
        target: 'http://n8n:5678',
        changeOrigin: true,
      },
      '/webhook': {
        target: 'http://n8n:5678',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: true,
    port: 3000,
    proxy: {
      '/webhook-test': {
        target: 'http://n8n:5678',
        changeOrigin: true,
      },
      '/webhook': {
        target: 'http://n8n:5678',
        changeOrigin: true,
      }
    }
  },
})
