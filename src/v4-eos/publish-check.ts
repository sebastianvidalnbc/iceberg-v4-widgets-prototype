// Pre-publish check per territory, shown when a variant's Publish switch is turned
// on. A territory needs a title to publish; the URL uses the territory's Primary
// URL (PURL) when one exists, otherwise it defaults to the page SLUG. Sample data
// derived from the variant name, since the prototype has no territory model.

export interface TerritoryCheck {
  territory: string;
  hasTitle: boolean;
  url: string | null;
  origin: "SLUG" | null;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stableHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function publishChecks(pageSlug: string, variantName: string): TerritoryCheck[] {
  const url = `${pageSlug}/${slugify(variantName)}`;
  // en-US always has a title; es-US only on some variants (the rest need one).
  const esHasTitle = stableHash(variantName) % 2 === 0;
  return [
    { territory: "US (en-US)", hasTitle: true, url, origin: "SLUG" },
    esHasTitle
      ? { territory: "US (es-US)", hasTitle: true, url, origin: "SLUG" }
      : { territory: "US (es-US)", hasTitle: false, url: null, origin: null },
  ];
}
