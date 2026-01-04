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
  private cache = new Map<string, any>();
  constructor(private http: HttpClient) {}

  /**
   * CONTEXT:
   * - Generic fetch with session-level caching
   * - Cache key is the raw path; assumes paths are unique across content types
   * - No cache invalidation; acceptable for static site where content changes require rebuild
   */
  async get<T>(path: string): Promise<T> {
    if (this.cache.has(path)) return this.cache.get(path);
    const data = await firstValueFrom(this.http.get<T>(path, { withCredentials: false }));
    this.cache.set(path, data);
    return data;
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
