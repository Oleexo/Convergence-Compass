import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + hash routing: works under https://<user>.github.io/<repo>/ without a 404 fallback.
// The item database (src/data/items.json) and its French translation (items.fr.json) are lazily loaded chunks of about 1 MB each, hence the raised warning limit.
export default defineConfig({ base: './', plugins: [react()], build: { chunkSizeWarningLimit: 1500 } });
