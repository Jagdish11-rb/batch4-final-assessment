import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-encr': {
        target: 'https://services-encr.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-encr/, ''),
        secure: true,
      },
      '/api-svc': {
        target: 'https://services.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-svc/, ''),
        secure: true,
      },
      '/api-nsdl': {
        target: 'https://apidev.iserveu.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-nsdl/, ''),
        secure: true,
      },
    },
  },
})
