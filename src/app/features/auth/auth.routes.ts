import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    title: 'Cuenta',
    children: [
      { path: APP_ROUTES.AUTH.LOGIN, loadComponent: () => import('./pages/login/login') },
      { path: APP_ROUTES.AUTH.REGISTER, loadComponent: () => import('./pages/register/register') },
      { path: '', redirectTo: APP_ROUTES.AUTH.LOGIN, pathMatch: 'full' },
    ],
  },
];
