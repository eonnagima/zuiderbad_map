import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // ensures relative paths work correctly
  build: {
    outDir: 'dist', // default output folder for Vercel
  },
});
