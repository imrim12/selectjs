import { defineConfig } from 'vite'

import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      name: 'SelectJS',
      entry: 'src/index.ts',
      formats: ['cjs', 'es', 'umd']
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist'
    })
  ]
})
