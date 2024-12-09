import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  sourcemap: true,
  plugins: [react()],
  server: {
    host: '0.0.0.0',  
    port: 80,          
  }
})