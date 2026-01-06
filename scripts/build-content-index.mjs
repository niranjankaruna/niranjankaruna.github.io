/**
 * CONTEXT:
 * - Build-time script; runs before Angular build via npm run dev:prepare
 * - Generates lightweight index files for list views (avoids fetching all content files)
 * - Output directory (content/indexes/) is gitignored; regenerated on each deploy
 * - Index schema must match ContentService expectations and list component templates
 * - Uses ES modules (type: module in package.json); Node 20+ required
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const INDEX_DIR = 'content/indexes';
const readJSON = async (p) => JSON.parse(await readFile(p, 'utf-8'));
const writeJSON = async (p, data) => writeFile(p, JSON.stringify(data, null, 2));

const normalizeAssetPath = (url) => {
  if (typeof url !== 'string') return '';
  // Important for GitHub Pages subdirectory deployments:
  // leading '/' ignores <base href> and breaks asset resolution.
  return url.startsWith('/') ? url.slice(1) : url;
};

const firstImage = (images) => {
  if (!Array.isArray(images) || images.length === 0) return '';
  const first = images[0];
  if (typeof first === 'string') return normalizeAssetPath(first);
  if (first && typeof first === 'object') {
    // Handle CMS list shapes like [{ image: '...' }]
    return normalizeAssetPath(first.image || first.url || '');
  }
  return '';
};

const variantPrices = (p) => {
  const variants = Array.isArray(p?.variants) ? p.variants : [];
  const prices = variants
    .map(v => Number.parseFloat(v?.rental?.price))
    .filter(n => Number.isFinite(n));
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

const variantCurrency = (p) => {
  const variants = Array.isArray(p?.variants) ? p.variants : [];
  return variants.map(v => v?.rental?.currency).find(Boolean) || null;
};

const formatPriceNumber = (n) => {
  // Keep simple numeric formatting like "42" or "42.5" (no currency symbol)
  if (!Number.isFinite(n)) return '';
  return Number.isInteger(n) ? String(n) : String(n);
};

await mkdir(INDEX_DIR, { recursive: true });

/**
 * CONTEXT:
 * - Generic indexer; pick function extracts fields needed for list views
 * - Filters out index.json (legacy) and .gitkeep (directory placeholder)
 * - Skips items without 'id' field to handle malformed CMS entries
 * - Sorts by id for consistent ordering across builds
 */
async function indexDir(sourceDir, outputName, pick) {
  const files = (await readdir(sourceDir)).filter(f => f.endsWith('.json') && f !== 'index.json' && f !== '.gitkeep');
  const items = [];
  for (const f of files) {
    const j = await readJSON(join(sourceDir, f));
    const picked = pick(j);
    if (picked && picked.id) items.push(picked);
  }
  items.sort((a, b) => a.id.toString().localeCompare(b.id.toString()));
  await writeJSON(join(INDEX_DIR, outputName), items);
}

/**
 * CONTEXT:
 * - Categories index minimal; only used for CMS relation dropdowns
 */
await indexDir('content/categories', 'categories.json', (c) => ({
  id: c.id, name: c.name
}));

/**
 * CONTEXT:
 * - Event index includes image for card thumbnails
 * - tileImage preferred over images array for explicit tile control
 */
await indexDir('content/event-types', 'event-types.json', (e) => ({
  id: e.id, name: e.name, summary: e.summary || '', image: (e.tileImage || (e.images?.[0] || '')), status: e.status || 'published'
}));

/**
 * CONTEXT:
 * - Product index includes rental pricing for list view display
 * - Null coalescing handles missing rental object gracefully
 */
await indexDir('content/products', 'products.json', (p) => ({
  id: p.id,
  name: p.name,
  currency: variantCurrency(p),
  priceMin: variantPrices(p)?.min ?? null,
  priceMax: variantPrices(p)?.max ?? null,
  priceLabel: (() => {
    const cur = variantCurrency(p);
    const pr = variantPrices(p);
    if (!cur || !pr) return null;
    if (pr.min === pr.max) return `${formatPriceNumber(pr.min)} ${cur}`;
    return `${formatPriceNumber(pr.min)} - ${formatPriceNumber(pr.max)} ${cur}`;
  })(),
  image: firstImage(p.images),
  category: p.category || '',
  status: p.status || 'published'
}));

/**
 * CONTEXT:
 * - Collections index includes full tier structure for pricing display
 * - productIds array enables reverse lookup (which collections use a product)
 * - Set used to deduplicate products appearing in multiple tiers
 */
await indexDir('content/collections', 'collections.json', (pkg) => ({
  id: pkg.id, name: pkg.name, eventType: pkg.eventType, image: (pkg.images?.[0] || ''),
  tiers: (pkg.tiers || []).map(t => ({ name: t.name, price: t.price, currency: t.currency, items: t.items?.map(i => i.product) || [] })),
  productIds: [...new Set((pkg.tiers || []).flatMap(t => (t.items || []).map(i => i.product)))],
  status: pkg.status || 'published'
}));
console.log("✅ Content indexes built");
