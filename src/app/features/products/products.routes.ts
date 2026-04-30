import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: APP_ROUTES.PRODUCTS.ROOT,
    title: APP_ROUTES.PRODUCTS.TITLE,
    data: { breadcrumb: APP_ROUTES.PRODUCTS.TITLE },
    loadComponent: () => import('./pages/shop/shop'),
  },
  {
    path: APP_ROUTES.PRODUCTS.DETAIL.ROOT,
    title: APP_ROUTES.PRODUCTS.DETAIL.TITLE,
    data: { breadcrumb: APP_ROUTES.PRODUCTS.TITLE },
    loadComponent: () => import('./pages/prod-details/prod-details'),
  },
];
