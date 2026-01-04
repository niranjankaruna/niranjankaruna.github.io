import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const readJSON = async (p) => JSON.parse(await readFile(p, 'utf-8'));

const productsDir = 'content/products';
const collectionsDir = 'content/collections';

const productSlugs = new Set((await readdir(productsDir)).filter(f=>f.endsWith('.json')).map(f=>f.replace('.json','')));

let ok = true;
for (const f of await readdir(collectionsDir)) {
  if (!f.endsWith('.json')) continue;
  const collection = await readJSON(join(collectionsDir, f));
  for (const t of (collection.tiers || [])) {
    for (const it of (t.items || [])) {
      if (!productSlugs.has(it.product)) {
        console.error(`❌ Missing product '${it.product}' in collection '${collection.slug}' / tier '${t.name}'`);
        ok = false;
      }
    }
  }
}
if (!ok) process.exit(1);
console.log("✅ Content references OK");
