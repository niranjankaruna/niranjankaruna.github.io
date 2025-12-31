import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white border-b">
      <div class="container py-4 flex items-center gap-6">
        <a routerLink="/" class="text-xl font-semibold">🎉 Decor Rentals</a>
        <nav class="ml-auto flex gap-4">
          <a routerLink="/search" routerLinkActive="font-semibold">Search</a>
          <a href="/admin/" target="_blank" class="text-sm badge">Admin</a>
        </nav>
      </div>
    </header>

    <main class="container my-8">
      <router-outlet></router-outlet>
    </main>

    <footer class="container py-10 text-sm text-gray-600">
      <p>&copy; {{year}} Decor Rentals</p>
    </footer>
  `
})
export class AppComponent {
  year = new Date().getFullYear();
}
