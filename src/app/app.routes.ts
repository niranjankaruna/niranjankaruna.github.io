import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'event/:slug', loadComponent: () => import('./pages/event.component').then(m => m.EventComponent) },
  { path: 'package/:slug', loadComponent: () => import('./pages/package.component').then(m => m.PackageComponent) },
  { path: 'product/:slug', loadComponent: () => import('./pages/product.component').then(m => m.ProductComponent) },
  { path: 'search', loadComponent: () => import('./pages/search.component').then(m => m.SearchComponent) },
  // Decap CMS is served as static /admin index.html separately
  { path: '**', redirectTo: '' }
];
