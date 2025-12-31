import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private r: Renderer2;
  constructor(private title: Title, private meta: Meta, rf: RendererFactory2) {
    this.r = rf.createRenderer(null, null);
  }

  setTitle(t: string) { this.title.setTitle(t); }
  setDescription(d: string) {
    this.meta.updateTag({ name: 'description', content: d });
    this.meta.updateTag({ property: 'og:description', content: d });
  }
  setOG(opts: { title?: string; image?: string; url?: string }) {
    if (opts.title) this.meta.updateTag({ property: 'og:title', content: opts.title });
    if (opts.image) this.meta.updateTag({ property: 'og:image', content: opts.image });
    if (opts.url) this.meta.updateTag({ property: 'og:url', content: opts.url });
  }

  injectJsonLd(data: any) {
    const script = this.r.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.r.appendChild(document.head, script);
  }
}
