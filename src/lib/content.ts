import { getCollection, type CollectionEntry } from 'astro:content';

export type DocEntry = CollectionEntry<'docs'>;
export type PatternEntry = CollectionEntry<'patterns'>;
export type KitEntry = CollectionEntry<'kits'>;

const byOrder = (a: { data: { order: number; title: string } }, b: typeof a) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

/** Docs ids look like `components/button`; the group is the folder. */
export const docGroup = (entry: DocEntry) => entry.id.split('/')[0] ?? '';
export const docSlug = (entry: DocEntry) => entry.id.split('/').slice(1).join('/');

export const DOC_GROUPS = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'components', label: 'Components' },
] as const;

export async function docsByGroup() {
  const entries = (await getCollection('docs')).sort(byOrder);
  return DOC_GROUPS.map((group) => ({
    ...group,
    entries:
      group.id === 'components'
        ? entries
            .filter((entry) => docGroup(entry) === group.id)
            .sort((a, b) => a.data.title.localeCompare(b.data.title))
        : entries.filter((entry) => docGroup(entry) === group.id),
  }));
}

export const sortedPatterns = async () => (await getCollection('patterns')).sort(byOrder);
export const sortedKits = async () => (await getCollection('kits')).sort(byOrder);

/** Patterns that compose the given component, shown on that component's page. */
export async function patternsUsing(componentId: string) {
  return (await sortedPatterns()).filter((pattern) =>
    pattern.data.components.includes(componentId),
  );
}

/** Component docs entries a pattern is built from, in the pattern's order. */
export async function componentsOf(pattern: PatternEntry) {
  const docs = await getCollection('docs');
  return pattern.data.components
    .map((id) => docs.find((entry) => entry.id === `components/${id}`))
    .filter((entry): entry is DocEntry => Boolean(entry));
}

export const featuredPatterns = async () =>
  (await sortedPatterns()).filter((pattern) => pattern.data.featured);
