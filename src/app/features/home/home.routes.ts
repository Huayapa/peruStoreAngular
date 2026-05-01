import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    title: APP_ROUTES.HOME.TITLE,
    loadComponent: () => import('./pages/home/home'),
  },
];
