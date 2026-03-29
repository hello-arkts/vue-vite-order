import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  base: '/order/',
  plugins: [
      vue(),
      // 图片压缩
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
      }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 5174,
    hmr: {
      clientPort: 5174,
      protocol: 'ws',
      host: 'localhost',
    }
  },
})