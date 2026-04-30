import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxies local /sealion-api/* → https://api.sea-lion.ai/* (avoids CORS in dev)
      '/sealion-api': {
        target: 'https://api.sea-lion.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sealion-api/, ''),
      },
    },
  },
})
