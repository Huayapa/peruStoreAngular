import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/app-routes';

export const routes: Routes = [
  {
    path: APP_ROUTES.HOME.ROOT,
    loadChildren: () => import('./features/home/home.routes').then((r) => r.HOME_ROUTES),
  },
  {
    path: APP_ROUTES.AUTH.ROOT,
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: APP_ROUTES.CART.ROOT,
    loadChildren: () => import('./features/cart/cart.routes').then((r) => r.CART_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/products/products.routes').then((r) => r.PRODUCTS_ROUTES),
  },
];
