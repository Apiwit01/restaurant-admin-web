// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'; // ใช้วิธี import แบบใหม่

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ใช้วิธีที่แน่นอนกว่าในการหาที่อยู่ของโฟลเดอร์ src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})