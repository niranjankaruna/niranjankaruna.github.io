import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'events', loadComponent: () => import('./pages/events-list.component').then(m => m.EventsListComponent) },
  { path: 'collections', loadComponent: () => import('./pages/collections-list.component').then(m => m.CollectionsListComponent) },
  { path: 'products', loadComponent: () => import('./pages/products-list.component').then(m => m.ProductsListComponent) },
  { path: 'event/:slug', loadComponent: () => import('./pages/event.component').then(m => m.EventComponent) },
  { path: 'collection/:slug', loadComponent: () => import('./pages/collection.component').then(m => m.CollectionComponent) },
  { path: 'product/:slug', loadComponent: () => import('./pages/product.component').then(m => m.ProductComponent) },
  { path: 'search', loadComponent: () => import('./pages/search.component').then(m => m.SearchComponent) },
  // Decap CMS is served as static /admin index.html separately
  { path: '**', redirectTo: '' }
];
