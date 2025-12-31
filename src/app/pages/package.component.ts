import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';
import { SeoService } from '../services/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './package.component.html'
})
export class PackageComponent {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private seo = inject(SeoService);

  pkg: any;
  tierIndex = 0;

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const pkg = await this.content.getPackage(slug);
    this.pkg = await this.content.resolvePackage(pkg);

    this.seo.setTitle(`${this.pkg.name} – Decor Rentals`);
    this.seo.setDescription(this.pkg.summary || '');
    this.seo.injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${this.pkg.name} (${this.pkg.tiers?.[this.tierIndex]?.name || 'Tier'})`,
      "areaServed": "IE",
      "image": this.pkg.images || [],
      "description": this.pkg.summary || "",
      "offers": {
        "@type": "Offer",
        "priceCurrency": this.pkg.tiers?.[this.tierIndex]?.currency || "EUR",
        "price": String(this.pkg.tiers?.[this.tierIndex]?.price || "")
      }
    });
  }
}
