import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.lorenzobaldassarri.it',
  trailingSlash: 'never',
  build: { format: 'file' },
});
