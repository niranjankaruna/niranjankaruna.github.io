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

  slug = '';
  event: any;
  packages: any[] = [];

  async ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug')!;
    this.event = await this.content.getEvent(this.slug);
    const allPkgs = await this.content.getPackagesIndex();
    this.packages = allPkgs.filter((p:any) => p.eventType === this.slug);
  }
}
