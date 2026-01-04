import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="content-wrapper">
        <h1 class="page-title">Event Types</h1>
        
        <div class="grid" *ngIf="events.length > 0">
          <div class="card" *ngFor="let event of events">
            <a [routerLink]="['/event', event.id]" class="card-link">
              <div class="card-image" *ngIf="event.image">
                <img [src]="event.image" [alt]="event.name">
              </div>
              <div class="card-content">
                <h3>{{ event.name }}</h3>
                <p *ngIf="event.summary">{{ event.summary }}</p>
              </div>
            </a>
          </div>
        </div>
        
        <p *ngIf="events.length === 0" class="empty-message">No events available</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      padding: 100px 20px 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-title {
      font-size: 2.5rem;
      color: white;
      text-align: center;
      margin-bottom: 40px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }
    
    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f0f0f0;
    }
    
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .card-content {
      padding: 20px;
    }
    
    .card-content h3 {
      margin: 0 0 10px;
      font-size: 1.5rem;
      color: #333;
    }
    
    .card-content p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .empty-message {
      text-align: center;
      color: white;
      font-size: 1.2rem;
      margin-top: 40px;
    }
  `]
})
export class EventsListComponent implements OnInit {
  events: any[] = [];

  constructor(private content: ContentService) {}

  async ngOnInit() {
    try {
      const data = await this.content.getEventsIndex();
      this.events = data.filter((e: any) => e.status === 'published');
    } catch (err) {
      console.error('Error loading events:', err);
    }
  }
}
