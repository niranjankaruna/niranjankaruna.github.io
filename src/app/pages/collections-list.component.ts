import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  selector: 'app-collections-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './collections-list.component.html',
  styleUrl: './collections-list.component.css'
})
export class CollectionsListComponent implements OnInit {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  collections: any[] = [];

  async ngOnInit() {
    const allCollections = await this.content.getCollectionsIndex();
    this.collections = allCollections.filter((c: any) => c.status === 'published');
    this.cdr.detectChanges();
  }
}
