# Tweakpad site

The documentation and showcase site for [Tweakpad UI](https://github.com/tweakpad/ui), built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + static build into dist/
npm run preview  # serve dist/
```

Node 24 (see `.nvmrc`).

## Structure

| Path | Contents |
| --- | --- |
| `src/content/docs/` | Getting-started guides and one MDX page per component. A component page's `tag` frontmatter pulls its API table from the package's custom elements manifest. |
| `src/content/patterns/` | Recipes composed from several components. `example` holds the composition, shown live on the pattern page; `featured` puts it on the home page canvas; `components` lists the component pages it uses, which link back under "Related patterns". |
| `src/content/kits/` | Plans for kits for niche products (audio editor, trading terminal, graph editor). The Kits page shows a coming-soon message for now. |
| `src/components/PatternCanvas.astro` | The home page: an endless, pannable grid of the featured pattern compositions. |
| `public/fonts/` | Fivo Sans (SIL Open Font License, see `OFL.txt`), self-hosted for body text. Display type is Anton from Google Fonts. |
| `src/components/Preview.astro` | Live example with a Default/Compact density selector and a Code toggle that shows the source in `tp-code-block`. |
| `src/styles/site.css` | Site chrome and the black-and-white tuning of the library's tokens. |

The site uses the published `@tweakpad/ui` package for every live demo and for its own chrome (theme switcher, search palette, buttons), so the header theme switcher re-themes the demos too.

## Writing a component page

Add `src/content/docs/components/<name>.mdx`:

```mdx
---
title: Badge
description: A short status or count label.
tag: tp-badge
---

import Preview from '../../../components/Preview.astro';

<Preview title="Variants" code={`<tp-badge>New</tp-badge>`} />
```

The markup in `code` is rendered live and shown as the copyable code. A `script` runs after it as a module and may import from `@tweakpad/ui` or `lit` like app code does; the page swaps those imports for the site's bundled copies, and the copyable code keeps them as written.

## Deploy

Pushes to `main` build and publish with `.github/workflows/deploy.yml`. The workflow reads the Pages origin and base path from `actions/configure-pages`, so links work both at `https://tweakpad.github.io/site/` and on a custom domain.
