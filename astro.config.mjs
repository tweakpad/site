// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// GitHub Pages serves the site from a sub-path (https://<owner>.github.io/<repo>/) unless a
// custom domain is set. The deploy workflow passes both values from actions/configure-pages.
const site = process.env.SITE_URL ?? 'https://tweakpad.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  integrations: [mdx()],
  vite: {
    // `@tweakpad/ui/register` defines every element in one chunk. Per-component registration
    // would split it; until then, keep the warning for chunks larger than that one.
    build: { chunkSizeWarningLimit: 2000 },
  },
  markdown: {
    shikiConfig: {
      // Both palettes are emitted as CSS variables; site.css picks one with light-dark().
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
