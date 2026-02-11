import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  publicDir: 'public', // ← INI DI LUAR PLUGINS!
  
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
  ],
  
  server: {
    port: 5173,
    strictPort: false,
  }
})