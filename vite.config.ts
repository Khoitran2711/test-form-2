
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Rất quan trọng: base './' giúp các file JS/CSS được tìm thấy chính xác trên GitHub Pages
  base: './',
  // Removed manual definition of process.env to follow SDK guidelines.
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
});
