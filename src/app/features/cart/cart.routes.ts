import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';

export const CART_ROUTES: Routes = [
  {
    path: '',
    title: APP_ROUTES.CART.TITLE,
    data: { breadcrumb: APP_ROUTES.CART.TITLE },
  },
];
