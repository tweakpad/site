/** Prefixes a site-absolute path with the configured base, so links work under a Pages sub-path. */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** True when `current` is `path` or one of its descendants. */
export function isActive(current: string, path: string): boolean {
  const target = url(path).replace(/\/$/, '');
  const here = current.replace(/\/$/, '');
  return here === target || here.startsWith(`${target}/`);
}
