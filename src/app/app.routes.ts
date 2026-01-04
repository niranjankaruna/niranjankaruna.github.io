import { Routes } from '@angular/router';

/**
 * CONTEXT:
 * - All routes use lazy loading via dynamic import for optimal bundle splitting
 * - Route parameter ':slug' corresponds to content 'id' field in CMS (identifier_field)
 * - List routes (/events, /collections, /products) fetch from auto-generated indexes
 * - Detail routes fetch individual JSON files from content folders
 * - /admin path excluded; served as static HTML by Angular build configuration
 * - Wildcard redirect ensures SPA fallback for unknown routes
 */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'events', loadComponent: () => import('./pages/events-list.component').then(m => m.EventsListComponent) },
  { path: 'collections', loadComponent: () => import('./pages/collections-list.component').then(m => m.CollectionsListComponent) },
  { path: 'products', loadComponent: () => import('./pages/products-list.component').then(m => m.ProductsListComponent) },
  { path: 'event/:slug', loadComponent: () => import('./pages/event.component').then(m => m.EventComponent) },
  { path: 'collection/:slug', loadComponent: () => import('./pages/collection.component').then(m => m.CollectionComponent) },
  { path: 'product/:slug', loadComponent: () => import('./pages/product.component').then(m => m.ProductComponent) },
  { path: 'search', loadComponent: () => import('./pages/search.component').then(m => m.SearchComponent) },
  { path: '**', redirectTo: '' }
];
