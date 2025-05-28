import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      external: ['@supabase/supabase-js'],
    },
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true
  }
})
