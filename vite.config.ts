import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  base: '/Frontend-Dev-Packages-Registry/',
  plugins: [
    react(),
    istanbul({
      include: ['src/**/*.{ts,tsx}'], // Include all TypeScript and TSX files in `src`
      exclude: ['node_modules', 'tests', 'coverage'], // Exclude specific folders
      extension: ['.ts', '.tsx'],
      requireEnv: false,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'], // Ensure tests are picked up
  },
});
