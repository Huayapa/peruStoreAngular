import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';
import { exitFormGuardFn } from '../../core/guards/exit-form-guard';

export const CART_ROUTES: Routes = [
  {
    path: '',
    title: APP_ROUTES.CART.TITLE,
    data: { breadcrumb: APP_ROUTES.CART.TITLE },
    loadComponent: () => import('./pages/cart-detail/cart-detail'),
  },
  {
    path: APP_ROUTES.CART.CHECKOUT.ROOT,
    title: APP_ROUTES.CART.CHECKOUT.TITLE,
    canDeactivate: [exitFormGuardFn],
    loadComponent: () => import('./pages/checkout/checkout'),
  },
  {
    path: APP_ROUTES.CART.SUCCESS.ROOT,
    title: APP_ROUTES.CART.SUCCESS.TITLE,
    loadComponent: () => import('./pages/payment-success/payment-success'),
  },
];
