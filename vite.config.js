import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 This line is new

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // allow client-side routing
  },
  resolve: { // 👈 This entire block is new
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})