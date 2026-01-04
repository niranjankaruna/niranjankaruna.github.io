import { Component, inject } from '@angular/core';
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
export class HomeComponent {
  private content = inject(ContentService);
  events: any[] = [];

  async ngOnInit() {
    this.events = await this.content.getEventsIndex();
  }
}
