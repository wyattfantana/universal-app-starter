import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Build into API's public directory for combined server
    outDir: path.resolve(__dirname, '../api/public'),
    emptyOutDir: true,
  },
})
