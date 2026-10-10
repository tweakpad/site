import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

/**
 * API reference rows read from the published package's Custom Elements Manifest, so component
 * pages always describe the version of @tweakpad/ui the site is built against.
 */
interface ManifestAttribute {
  name: string;
  type?: { text?: string };
  default?: string;
  inheritedFrom?: { name?: string };
}
interface ManifestEvent {
  name?: string;
  inheritedFrom?: { name?: string };
}
interface ManifestDeclaration {
  tagName?: string;
  name?: string;
  attributes?: ManifestAttribute[];
  events?: ManifestEvent[];
}
interface Manifest {
  modules: { declarations?: ManifestDeclaration[] }[];
}

export interface ElementApi {
  tagName: string;
  className: string;
  attributes: { name: string; type: string; default: string }[];
  events: string[];
}

const require = createRequire(import.meta.url);
const packageJsonPath = require.resolve('@tweakpad/ui/package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
  version: string;
  customElements: string;
};
const manifest = JSON.parse(
  readFileSync(join(dirname(packageJsonPath), packageJson.customElements), 'utf8'),
) as Manifest;

export const uiVersion = packageJson.version;

/** Base-element attributes every component accepts; listed once on the page, not per row. */
const SHARED_BASE = 'TpElement';
const SHARED_KEPT = new Set(['disabled']);

export function elementApi(tagName: string): ElementApi | undefined {
  for (const module of manifest.modules) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.tagName !== tagName) continue;
      return {
        tagName,
        className: declaration.name ?? '',
        attributes: (declaration.attributes ?? [])
          .filter(
            (attribute) =>
              // The analyzer also lists private reactive state (`_copied`), which is not API.
              !attribute.name.startsWith('_') &&
              (attribute.inheritedFrom?.name !== SHARED_BASE || SHARED_KEPT.has(attribute.name)),
          )
          .map((attribute) => ({
            name: attribute.name,
            type: attribute.type?.text ?? '',
            default: attribute.default ?? '',
          })),
        events: [
          ...new Set(
            (declaration.events ?? [])
              .map((event) => event.name ?? '')
              .filter((name) => name && name !== 'tp-diagnostic'),
          ),
        ],
      };
    }
  }
  return undefined;
}
