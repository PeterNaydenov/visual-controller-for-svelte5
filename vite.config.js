import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'VisualControllerSvelte5',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        const map = {
          es: 'visualController-svelte-5.esm.mjs',
          cjs: 'visualController-svelte-5.cjs',
          umd: 'visualController-svelte-5.umd.js'
        }
        return map[format]
      }
    },
    rollupOptions: {
      external: ['svelte', 'ask-for-promise'],
      output: {
        globals: {
          svelte: 'svelte',
          'ask-for-promise': 'askForPromise'
        }
      }
    }
  }
})
