import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  private content = inject(ContentService);
  q = '';
  products: any[] = [];
  collections: any[] = [];

  async ngOnInit() {
    this.products = await this.content.getProductsIndex();
    this.collections = await this.content.getCollectionsIndex();
  }

  get filteredProducts() {
    const q = this.q.toLowerCase();
    return this.products.filter((p:any)=> p.name.toLowerCase().includes(q));
  }
  get filteredCollections() {
    const q = this.q.toLowerCase();
    return this.collections.filter((p:any)=> p.name.toLowerCase().includes(q));
  }
}
