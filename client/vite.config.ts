import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'PixelFlow',
        short_name: 'PixelFlow',
        description: 'Photography portfolio platform for creators',
        theme_color: '#1a1a2e',
        background_color: '#0d0d0d',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('recharts')) return 'vendor-charts'
          if (id.includes('react-dropzone') || id.includes('browser-image-compression') || id.includes('exifr')) return 'vendor-upload'
          if (id.includes('@mui/')) return 'vendor-mui'
          if (id.includes('@reduxjs') || id.includes('react-redux') || id.includes('@tanstack')) return 'vendor-state'
          if (id.includes('node_modules/react') || id.includes('react-router')) return 'vendor-react'
        },
      },
    },
  },
})
