import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      name: 'SelectJS',
      entry: 'src/index.ts',
    },
  }
})
