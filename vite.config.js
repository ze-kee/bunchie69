import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/bunchie69/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'background.png',
          dest: '.'
        },
        {
          src: 'bunchie22.png',
          dest: '.'
        }
      ]
    })
  ]
}) 