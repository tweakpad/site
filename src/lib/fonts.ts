import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { url } from './url';

/**
 * Fivo Sans is self-hosted from public/fonts/. A weight gets an @font-face only when its file is
 * there, so the page never requests a missing font; until then the body falls back to Geist.
 */
const WEIGHTS: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  heavy: 900,
  black: 900,
};
const FORMATS: Record<string, string> = { woff2: 'woff2', woff: 'woff', otf: 'opentype', ttf: 'truetype' };

// Builds run from the project root (npm scripts and CI).
const directory = join(process.cwd(), 'public', 'fonts');
const files = existsSync(directory) ? readdirSync(directory) : [];

export const bodyFontFaces = files
  .map((file) => {
    const match = /^fivo-?sans-?(?<weight>[a-z]+)?(?<italic>-?italic)?\.(?<ext>woff2|woff|otf|ttf)$/i.exec(
      file,
    );
    if (!match?.groups) return '';
    const weight = WEIGHTS[(match.groups.weight ?? 'regular').toLowerCase()] ?? 400;
    const style = match.groups.italic ? 'italic' : 'normal';
    const format = FORMATS[match.groups.ext.toLowerCase()];
    return `@font-face{font-family:'Fivo Sans';src:url('${url(`/fonts/${file}`)}') format('${format}');font-weight:${weight};font-style:${style};font-display:swap}`;
  })
  .filter(Boolean);
