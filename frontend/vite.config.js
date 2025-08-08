import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /api to your backend server
      '/api': {
        target: 'http://localhost:5001', // Your backend URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // If you're not using https
      },
    },
  },
})