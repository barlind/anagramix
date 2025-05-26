import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    allowedHosts: ['humane-chamois-uniformly.ngrok-free.app', 'barlind.github.io']
  }
})