import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css'
})
export class AppComponent {
  title = 'decor-rentals';
  isMenuOpen = false;
  currentYear = new Date().getFullYear();
  isEventsPage = false;
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isEventsPage = event.urlAfterRedirects === '/events';
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
