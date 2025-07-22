import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 4660,
    strictPort: true,
    hmr: {
      clientPort: 443,
      path: 'wss://conexion360sac.com/ws'
    },
    // Añadir esta línea para permitir el host
    allowedHosts: ['conexion360sac.com', 'www.conexion360sac.com']
  },
  preview: {
    port: 4660,
    strictPort: true
  }
})