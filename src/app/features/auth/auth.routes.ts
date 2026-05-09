import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';
import { exitFormGuardFn } from '../../core/guards/exit-form-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    title: APP_ROUTES.AUTH.TITLE,
    data: { breadcrumb: APP_ROUTES.AUTH.TITLE },
    children: [
      {
        path: APP_ROUTES.AUTH.LOGIN.ROOT,
        title: APP_ROUTES.AUTH.LOGIN.TITLE,
        canDeactivate: [exitFormGuardFn],
        data: { breadcrumb: APP_ROUTES.AUTH.LOGIN.TITLE },
        loadComponent: () => import('./pages/login/login'),
      },
      {
        path: APP_ROUTES.AUTH.REGISTER.ROOT,
        title: APP_ROUTES.AUTH.REGISTER.TITLE,
        canDeactivate: [exitFormGuardFn],
        data: { breadcrumb: APP_ROUTES.AUTH.REGISTER.TITLE },
        loadComponent: () => import('./pages/register/register'),
      },
      {
        path: '',
        redirectTo: APP_ROUTES.AUTH.LOGIN.ROOT,
        pathMatch: 'full',
      },
    ],
  },
];
