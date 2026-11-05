import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Library build: the components ship as a package and Storybook is the workshop, so there is no app entry.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'graphpaper', cssFileName: 'graphpaper' },
    rolldownOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
  },
});
