import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/order/',
  plugins: [vue()],
  server: {
    hmr: {
      clientPort: 5173,
      protocol: 'ws',
      path: '/hmr/'
    }
  }
})