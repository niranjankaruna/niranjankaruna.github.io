import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { SeoService } from '../services/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html'
})
export class ProductComponent {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private seo = inject(SeoService);

  product: any;
  usedIn: any[] = [];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.product = await this.content.getProduct(id);
    const collections = await this.content.getCollectionsIndex();
    this.usedIn = collections.filter((p:any) => (p.productIds||[]).includes(id));

    this.seo.setTitle(`${this.product.name} – Decor Rentals`);
    this.seo.setDescription(this.product.seo?.description || '');
    this.seo.injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": this.product.name,
      "sku": this.product.sku || undefined,
      "image": this.product.images || [],
      "description": this.product.seo?.description || "",
      "offers": {
        "@type": "Offer",
        "priceCurrency": this.product.rental?.currency || "EUR",
        "price": String(this.product.rental?.price ?? "")
      }
    });
  }
}
