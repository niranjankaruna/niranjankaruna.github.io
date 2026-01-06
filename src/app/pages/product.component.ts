import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../services/content.service';
import { SeoService } from '../services/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  product: any;
  usedIn: any[] = [];
  selectedImage: string | null = null;
  showVideo = false;
  sanitizedVideos: SafeResourceUrl[] = [];

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.product = await this.content.getProduct(id);
    this.selectedImage = (this.product.images || [])[0] || null;
    const collections = await this.content.getCollectionsIndex();
    this.usedIn = collections.filter((p:any) => (p.productIds||[]).includes(id));

    // Sanitize video URLs
    this.sanitizedVideos = (this.product.videos || []).map((url: string) => 
      this.sanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(url))
    );

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

  convertToEmbedUrl(url: string): string {
    // Convert YouTube watch URL to embed URL
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }

  setSelected(image: string) {
    this.selectedImage = image;
    this.showVideo = false;
  }

  playVideo() {
    this.showVideo = true;
    this.selectedImage = null;
  }

  normalizeAssetPath(url: string | null | undefined): string | null {
    if (!url) return null;
    // Important for GitHub Pages subdirectory deployments:
    // leading '/' ignores <base href> and breaks asset resolution.
    return url.startsWith('/') ? url.slice(1) : url;
  }

  getImageUrl(url: string | null): string {
    const normalized = this.normalizeAssetPath(url);
    if (!normalized) return 'none';
    return `url("${normalized}")`;
  }

  get heroImage(): string {
    const src = this.selectedImage || (this.product?.images || [])[0];
    return src ? `url('${src}')` : 'linear-gradient(135deg, rgba(248,106,46,0.6), rgba(249,196,65,0.6), rgba(44,168,217,0.6))';
  }

  get mainImage(): string {
    const src = this.selectedImage || (this.product?.images || [])[0];
    return src ? `url('${src}')` : 'none';
  }
}
