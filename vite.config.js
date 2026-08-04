import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  publicDir: false,
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'VisualController',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `visual-controller-for-svelte5.${format === 'es' ? 'esm.mjs' : format === 'umd' ? 'umd.js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['svelte', 'ask-for-promise'],
      output: {
        dir: 'dist',
        globals: { svelte: 'svelte', 'ask-for-promise': 'askForPromise' }
      }
    }
  }
})
