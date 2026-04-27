import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./pages/home/home'),
  },
];
