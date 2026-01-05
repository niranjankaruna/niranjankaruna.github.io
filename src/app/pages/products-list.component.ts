import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  products: any[] = [];

  async ngOnInit() {
    const allProducts = await this.content.getProductsIndex();
    this.products = allProducts.filter((p: any) => p.status === 'published');
    this.cdr.detectChanges();
  }
}
