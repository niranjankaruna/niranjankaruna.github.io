import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  events: any[] = [];

  async ngOnInit() {
    const allEvents = await this.content.getEventsIndex();
    this.events = allEvents.filter((e: any) => e.status === 'published');
    console.log('Events loaded:', this.events);
    this.cdr.detectChanges();
  }
}
