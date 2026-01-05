import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  selector: 'app-events-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent implements OnInit {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  events: any[] = [];

  async ngOnInit() {
    const allEvents = await this.content.getEventsIndex();
    this.events = allEvents.filter((e: any) => e.status === 'published');
    this.cdr.detectChanges();
  }
}
