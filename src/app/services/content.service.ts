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

  // Indexes
  getEventsIndex() { return this.get<any[]>('/content/event-types/index.json'); }
  getProductsIndex() { return this.get<any[]>('/content/products/index.json'); }
  getPackagesIndex() { return this.get<any[]>('/content/packages/index.json'); }

  // Singletons
  getEvent(slug: string) { return this.get<any>(`/content/event-types/${slug}.json`); }
  getProduct(slug: string) { return this.get<any>(`/content/products/${slug}.json`); }
  getPackage(slug: string) { return this.get<any>(`/content/packages/${slug}.json`); }

  // Resolve package tier items -> product data
  async resolvePackage(pkg: any) {
    for (const tier of pkg.tiers || []) {
      tier.resolvedItems = await Promise.all((tier.items || []).map(async (it: any) => ({
        ...it,
        productData: await this.getProduct(it.product)
      })));
    }
    return pkg;
  }
}
