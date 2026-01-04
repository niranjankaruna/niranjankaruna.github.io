import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const INDEX_DIR = 'content/indexes';
const readJSON = async (p) => JSON.parse(await readFile(p, 'utf-8'));
const writeJSON = async (p, data) => writeFile(p, JSON.stringify(data, null, 2));

await mkdir(INDEX_DIR, { recursive: true });

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

await indexDir('content/event-types', 'event-types.json', (e) => ({
  id: e.id, name: e.name, summary: e.summary || '', image: (e.tileImage || (e.images?.[0] || '')), status: e.status || 'published'
}));

// For products we index minimal fields
await indexDir('content/products', 'products.json', (p) => ({
  id: p.id, name: p.name, price: p.rental?.price ?? null, currency: p.rental?.currency ?? null,
  image: (p.images?.[0] || ''), category: p.category || '', status: p.status || 'published'
}));

// For collections include eventType and flattened product ids for reverse lookup
await indexDir('content/collections', 'collections.json', (pkg) => ({
  id: pkg.id, name: pkg.name, eventType: pkg.eventType, image: (pkg.images?.[0] || ''),
  tiers: (pkg.tiers || []).map(t => ({ name: t.name, price: t.price, currency: t.currency, items: t.items?.map(i => i.product) || [] })),
  productIds: [...new Set((pkg.tiers || []).flatMap(t => (t.items || []).map(i => i.product)))],
  status: pkg.status || 'published'
}));
console.log("✅ Content indexes built");
