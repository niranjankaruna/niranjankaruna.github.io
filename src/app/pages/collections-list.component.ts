import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  selector: 'app-collections-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './collections-list.component.html',
  styleUrl: './collections-list.component.css'
})
export class CollectionsListComponent implements OnInit {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  eventGroups: Array<{ eventId: string; eventName: string; tileImage?: string; collections: any[] }> = [];

  async ngOnInit() {
    const [allEvents, allCollections] = await Promise.all([
      this.content.getEventsIndex(),
      this.content.getCollectionsIndex()
    ]);

    const publishedEvents = (allEvents || []).filter((e: any) => e.status === 'published');
    const publishedCollections = (allCollections || []).filter((c: any) => c.status === 'published');

    const byEventType = new Map<string, any[]>();
    for (const c of publishedCollections) {
      const key = c?.eventType || 'other';
      const arr = byEventType.get(key) || [];
      arr.push(c);
      byEventType.set(key, arr);
    }

    const groups: Array<{ eventId: string; eventName: string; tileImage?: string; collections: any[] }> = [];

    // Preserve event ordering from the index; include sections even if empty.
    for (const e of publishedEvents) {
      const cols = byEventType.get(e.id) || [];
      groups.push({ eventId: e.id, eventName: e.name || e.id, tileImage: e.tileImage || '', collections: cols });
      byEventType.delete(e.id);
    }

    // Append any collections with unknown/missing eventType.
    for (const [eventId, cols] of byEventType.entries()) {
      if (!cols.length) continue;
      const label = eventId === 'other' ? 'Other' : eventId;
      groups.push({ eventId, eventName: label, tileImage: '', collections: cols });
    }

    this.eventGroups = groups;
    this.cdr.detectChanges();
  }

  normalizeAssetPath(url: string | null | undefined): string {
    if (!url) return '';
    return url.startsWith('/') ? url.slice(1) : url;
  }

  scrollCarousel(trackEl: HTMLElement, dir: number) {
    const delta = Math.max(240, Math.round(trackEl.clientWidth * 0.9));
    trackEl.scrollBy({ left: dir * delta, behavior: 'smooth' });
  }
}
