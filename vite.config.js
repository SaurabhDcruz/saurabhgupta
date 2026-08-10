import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three-heavy';
            if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'three-fiber';
            if (id.includes('@react-three/postprocessing')) return 'postprocessing';
            if (id.includes('gsap') || id.includes('lenis')) return 'animations';
            if (id.includes('@emailjs')) return 'emailjs';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
