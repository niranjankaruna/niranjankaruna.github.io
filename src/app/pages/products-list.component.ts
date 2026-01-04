import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="content-wrapper">
        <h1 class="page-title">Products</h1>
        
        <div class="grid" *ngIf="products.length > 0">
          <div class="card" *ngFor="let product of products">
            <a [routerLink]="['/product', product.id]" class="card-link">
              <div class="card-image" *ngIf="product.image">
                <img [src]="product.image" [alt]="product.name">
              </div>
              <div class="card-content">
                <h3>{{ product.name }}</h3>
                <p class="category" *ngIf="product.category">{{ product.category }}</p>
                <p class="price" *ngIf="product.price">
                  {{ product.price }} {{ product.currency }}/rental
                </p>
              </div>
            </a>
          </div>
        </div>
        
        <p *ngIf="products.length === 0" class="empty-message">No products available</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      padding: 100px 20px 40px;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
      margin: 0 0 8px;
      font-size: 1.3rem;
      color: #333;
    }
    
    .category {
      color: #666;
      font-size: 0.9rem;
      margin: 4px 0;
      text-transform: capitalize;
    }
    
    .price {
      margin: 8px 0 0;
      color: #10b981;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .empty-message {
      text-align: center;
      color: white;
      font-size: 1.2rem;
      margin-top: 40px;
    }
  `]
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];

  constructor(private content: ContentService) {}

  async ngOnInit() {
    try {
      const data = await this.content.getProductsIndex();
      this.products = data.filter((p: any) => p.status === 'published');
    } catch (err) {
      console.error('Error loading products:', err);
    }
  }
}
