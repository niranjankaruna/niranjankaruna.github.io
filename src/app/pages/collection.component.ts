import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../services/content.service';
import { SeoService } from '../services/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  collection: any;
  tierIndex = 0;

  selectedImage: string | null = null;
  showVideo = false;
  sanitizedVideos: SafeResourceUrl[] = [];
  selectedVideoIndex = 0;

  get selectedTier(): any | null {
    return this.collection?.tiers?.[this.tierIndex] || null;
  }

  selectTier(index: number) {
    this.tierIndex = index;
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const collection = await this.content.getCollection(id);
    this.collection = await this.content.resolveCollection(collection);

    this.tierIndex = 0;
    this.selectedImage = (this.collection.images || [])[0] || null;
    this.selectedVideoIndex = 0;
    this.showVideo = false;

    this.sanitizedVideos = (this.collection.videos || []).map((url: string) =>
      this.sanitizer.bypassSecurityTrustResourceUrl(this.convertToEmbedUrl(url))
    );

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
        "priceCurrency": this.selectedTier?.currency || "EUR",
        "price": String(this.selectedTier?.price || "")
      }
    });
  }

  convertToEmbedUrl(url: string): string {
    if (!url) return url;
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

  playVideo(index: number) {
    this.selectedVideoIndex = index;
    this.showVideo = true;
    this.selectedImage = null;
  }

  normalizeAssetPath(url: string | null | undefined): string | null {
    if (!url) return null;
    return url.startsWith('/') ? url.slice(1) : url;
  }

  getImageUrl(url: string | null): string {
    const normalized = this.normalizeAssetPath(url);
    if (!normalized) return 'none';
    return `url("${normalized}")`;
  }
}
