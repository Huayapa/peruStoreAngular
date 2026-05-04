import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';
import { productTitleResolver } from './resolvers/product-title-resolver';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    title: APP_ROUTES.PRODUCTS.TITLE,
    data: { breadcrumb: APP_ROUTES.PRODUCTS.TITLE },
    loadComponent: () => import('./pages/shop/shop'),
  },
  {
    path: APP_ROUTES.PRODUCTS.DETAIL.ROOT,
    title: productTitleResolver,
    data: { breadcrumb: APP_ROUTES.PRODUCTS.TITLE },
    loadComponent: () => import('./pages/prod-details/prod-details'),
  },
];
