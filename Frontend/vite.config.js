import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:
  {allowedHosts:["b915-117-213-200-3.ngrok-free.app"]}
})
