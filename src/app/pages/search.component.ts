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
  packages: any[] = [];

  async ngOnInit() {
    this.products = await this.content.getProductsIndex();
    this.packages = await this.content.getPackagesIndex();
  }

  get filteredProducts() {
    const q = this.q.toLowerCase();
    return this.products.filter((p:any)=> p.name.toLowerCase().includes(q));
  }
  get filteredPackages() {
    const q = this.q.toLowerCase();
    return this.packages.filter((p:any)=> p.name.toLowerCase().includes(q));
  }
}
