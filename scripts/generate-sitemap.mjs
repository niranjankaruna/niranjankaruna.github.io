import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const domain = 'https://example.com';
const urls = new Set([
  '/', '/search'
]);

async function pushAll(dir, routeBase) {
  const files = (await readdir(dir)).filter(f=>f.endsWith('.json') && f!=='index.json');
  for (const f of files) {
    const slug = f.replace('.json','');
    urls.add(`${routeBase}/${slug}`);
  }
}
await pushAll('content/event-types', '/event');
await pushAll('content/products', '/product');
await pushAll('content/collections', '/collection');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].map(u => `  <url><loc>${domain}${u}</loc><lastmod>2025-12-31</lastmod></url>`).join('\n')}
</urlset>`;

await writeFile('public/sitemap.xml', xml);
console.log("✅ sitemap.xml generated");
