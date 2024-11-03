import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/**/*',             // Instrument files in the src directory
      exclude: ['node_modules', 'tests'], // Exclude node_modules and test files
      extension: [ '.ts', '.tsx' ],     // Specify file extensions
      // cypress: true,                    // Set to true if using Cypress, ignore for Selenium
      requireEnv: false                 // Instrument code regardless of environment
    })
  ]
});
