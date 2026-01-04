import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  selector: 'app-collections-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="content-wrapper">
        <h1 class="page-title">Collections</h1>
        
        <div class="grid" *ngIf="collections.length > 0">
          <div class="card" *ngFor="let collection of collections">
            <a [routerLink]="['/collection', collection.id]" class="card-link">
              <div class="card-image" *ngIf="collection.image">
                <img [src]="collection.image" [alt]="collection.name">
              </div>
              <div class="card-content">
                <h3>{{ collection.name }}</h3>
                <div class="tiers" *ngIf="collection.tiers && collection.tiers.length > 0">
                  <span class="tier" *ngFor="let tier of collection.tiers">
                    {{ tier.name }}: {{ tier.price }} {{ tier.currency }}
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
        
        <p *ngIf="collections.length === 0" class="empty-message">No collections available</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      padding: 100px 20px 40px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    
    .tiers {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    
    .tier {
      background: #f0f0f0;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #555;
    }
    
    .empty-message {
      text-align: center;
      color: white;
      font-size: 1.2rem;
      margin-top: 40px;
    }
  `]
})
export class CollectionsListComponent implements OnInit {
  collections: any[] = [];

  constructor(private content: ContentService) {}

  ngOnInit() {
    this.content.getCollectionsIndex().subscribe({
      next: (data) => {
        this.collections = data.filter((c: any) => c.status === 'published');
      },
      error: (err) => console.error('Error loading collections:', err)
    });
  }
}
