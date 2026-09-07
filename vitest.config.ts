import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  test: {
    root: __dirname,
    environment: 'jsdom',
    include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['./test/setup.ts'],
    testTimeout: 1000 * 29,
  },
})
