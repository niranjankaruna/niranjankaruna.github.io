import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
