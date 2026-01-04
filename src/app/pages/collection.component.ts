import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { SeoService } from '../services/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './collection.component.html'
})
export class CollectionComponent {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private seo = inject(SeoService);

  collection: any;
  tierIndex = 0;

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const collection = await this.content.getCollection(slug);
    this.collection = await this.content.resolveCollection(collection);

    this.seo.setTitle(`${this.collection.name} – Decor Rentals`);
    this.seo.setDescription(this.collection.summary || '');
    this.seo.injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${this.collection.name} (${this.collection.tiers?.[this.tierIndex]?.name || 'Tier'})`,
      "areaServed": "IE",
      "image": this.collection.images || [],
      "description": this.collection.summary || "",
      "offers": {
        "@type": "Offer",
        "priceCurrency": this.collection.tiers?.[this.tierIndex]?.currency || "EUR",
        "price": String(this.collection.tiers?.[this.tierIndex]?.price || "")
      }
    });
  }
}
