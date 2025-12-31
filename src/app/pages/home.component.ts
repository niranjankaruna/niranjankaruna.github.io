import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../services/content.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private content = inject(ContentService);
  events: any[] = [];
  packages: any[] = [];

  async ngOnInit() {
    this.events = await this.content.getEventsIndex();
    this.packages = (await this.content.getPackagesIndex()).slice(0, 6);
  }
}
