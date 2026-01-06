import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * CONTEXT:
 * - Uses Promise-based API (async/await) instead of Observables for simpler component consumption
 * - Converts HttpClient Observable to Promise via firstValueFrom for one-time fetches
 * - In-memory cache prevents redundant network requests during single session
 * - Relative paths (no leading slash) required for GitHub Pages subdirectory compatibility
 * - withCredentials: false explicitly set to avoid CORS preflight on static JSON
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  // Cache-buster for GitHub Pages / CDN / browser caching.
  // This changes on every full page reload.
  private readonly cacheBust = Date.now().toString(36);
  constructor(private http: HttpClient) {}

  /**
   * CONTEXT:
   * - Generic fetch
   * - Adds cache-busting query param because static hosts can serve stale JSON
   */
  async get<T>(path: string): Promise<T> {
    const url = this.withCacheBust(path);
    return await firstValueFrom(this.http.get<T>(url, { withCredentials: false }));
  }

  private withCacheBust(path: string): string {
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}v=${this.cacheBust}`;
  }

  /**
   * CONTEXT:
   * - Index files are auto-generated at build time by scripts/build-content-index.mjs
   * - Indexes contain minimal fields for list views; detail pages fetch full JSON
   * - Paths match output of build script; changes require sync
   */
  getEventsIndex() { return this.get<any[]>('content/indexes/event-types.json'); }
  getProductsIndex() { return this.get<any[]>('content/indexes/products.json'); }
  getCollectionsIndex() { return this.get<any[]>('content/indexes/collections.json'); }

  /**
   * CONTEXT:
   * - Slug parameter maps to filename (e.g., 'birthday' -> 'birthday.json')
   * - CMS uses 'id' as identifier_field; slug/id used interchangeably in routes
   */
  getEvent(slug: string) { return this.get<any>(`content/event-types/${slug}.json`); }
  getProduct(slug: string) { return this.get<any>(`content/products/${slug}.json`); }
  getCollection(slug: string) { return this.get<any>(`content/collections/${slug}.json`); }

  /**
   * CONTEXT:
   * - Hydrates collection tier items with full product data for detail view
   * - Sequential fetch per product; acceptable for small catalogs
   * - Mutates original collection object; caller receives enriched data
   * - Product references use 'id' field stored in tier.items[].product
   */
  async resolveCollection(collection: any) {
    for (const tier of collection.tiers || []) {
      tier.resolvedItems = await Promise.all((tier.items || []).map(async (it: any) => ({
        ...it,
        productData: await this.getProduct(it.product)
      })));
    }
    return collection;
  }
}
