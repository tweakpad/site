/**
 * MDX drops up to two leading spaces from every continuation line of an expression inside a JSX
 * attribute, so a multi-line sample written as code={`...`} would lose its nesting. Before MDX
 * parses a page, this rewrites the `code` and `script` template literals into one-line string
 * literals, which keep the indentation exactly as written.
 */
const LITERAL = /\b(code|script)=\{`((?:\\[\s\S]|[^`\\])*)`\}/g;

export default function literalCode() {
  return {
    name: 'tweakpad:literal-code',
    enforce: 'pre',
    transform(source, id) {
      if (!id.split('?')[0].endsWith('.mdx')) return;
      const code = source.replace(LITERAL, (_, name, raw) => {
        // The samples hold no interpolations (`${` is always escaped), so this only unescapes.
        const value = new Function(`return \`${raw}\`;`)();
        return `${name}={${JSON.stringify(value)}}`;
      });
      return code === source ? undefined : { code, map: null };
    },
  };
}
