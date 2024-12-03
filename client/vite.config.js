import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.mjs': 'js', // Ensure `.mjs` files are handled as JavaScript
      },
    },
  },
});
