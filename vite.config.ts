import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + hash routing: works under https://<user>.github.io/<repo>/ without a 404 fallback.
export default defineConfig({ base: './', plugins: [react()] });
