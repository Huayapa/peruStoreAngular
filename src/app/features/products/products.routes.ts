import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: APP_ROUTES.PRODUCTS.ROOT,
    title: 'Productos',
    loadComponent: () => import('./pages/shop/shop'),
  },
  {
    path: APP_ROUTES.PRODUCTS.DETAIL,
    loadComponent: () => import('./pages/prod-details/prod-details'),
  },
];
