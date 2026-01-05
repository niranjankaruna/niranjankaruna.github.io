import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  private route = inject(ActivatedRoute);
  private content = inject(ContentService);

  id = '';
  event: any;
  collections: any[] = [];

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.event = await this.content.getEvent(this.id);
    const allCollections = await this.content.getCollectionsIndex();
    this.collections = allCollections.filter((p:any) => p.eventType === this.id);
  }
}
