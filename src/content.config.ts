import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Docs: getting-started guides and one page per foundational component. */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(100),
    /** Custom element whose API table the page shows, read from the package manifest. */
    tag: z.string().optional(),
  }),
});

/** Patterns: copyable compositions of several components, such as a sign-in screen. */
const patterns = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(100),
    category: z.string(),
    /** Shown on the home page canvas. Only reviewed, real-scenario compositions are featured. */
    featured: z.boolean().default(false),
    /** The composition: rendered live on the pattern page and the home canvas, and the copyable code. */
    example: z.string(),
    /** Docs component ids (for example `button`) this pattern is built from. */
    components: z.array(z.string()),
  }),
});

/** Kits: niche controls, compositions and a theme for one kind of product. */
const kits = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/kits' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(100),
    status: z.enum(['planned', 'preview', 'stable']),
    /** The kit's accent, used on its card and page header. */
    accent: z.string(),
    controls: z.array(z.object({ name: z.string(), description: z.string() })),
  }),
});

export const collections = { docs, patterns, kits };
