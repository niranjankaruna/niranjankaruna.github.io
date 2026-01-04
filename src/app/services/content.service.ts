import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private cache = new Map<string, any>();
  constructor(private http: HttpClient) {}

  async get<T>(path: string): Promise<T> {
    if (this.cache.has(path)) return this.cache.get(path);
    const data = await firstValueFrom(this.http.get<T>(path, { withCredentials: false }));
    this.cache.set(path, data);
    return data;
  }

  // Indexes (relative paths for GitHub Pages compatibility)
  getEventsIndex() { return this.get<any[]>('content/indexes/event-types.json'); }
  getProductsIndex() { return this.get<any[]>('content/indexes/products.json'); }
  getCollectionsIndex() { return this.get<any[]>('content/indexes/collections.json'); }

  // Singletons
  getEvent(slug: string) { return this.get<any>(`content/event-types/${slug}.json`); }
  getProduct(slug: string) { return this.get<any>(`content/products/${slug}.json`); }
  getCollection(slug: string) { return this.get<any>(`content/collections/${slug}.json`); }

  // Resolve collection tier items -> product data
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
