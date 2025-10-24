import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      api: '/src/api',
      components: '/src/components',
      lib: '/src/lib',
      pages: '/src/pages',
      store: '/src/store',
      services: '/src/services',
      types: '/src/types',
      schemas: '/src/schemas',
    },
  },
})
