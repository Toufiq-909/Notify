import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { offlineShell } from './offline-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),offlineShell()],
  server:
  {allowedHosts:["b915-117-213-200-3.ngrok-free.app"]}
})
