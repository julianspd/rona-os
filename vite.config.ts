import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Without this the minifier emits `@media (width<=760px)`, which
    // Safari only understands from 16.4. Older iPhones drop the whole
    // mobile block and get the desktop layout.
    cssTarget: ['safari14', 'chrome87', 'firefox78'],
  },
  plugins: [react()],
})
