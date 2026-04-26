import { Routes } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/app-routes';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    title: 'Cuenta',
    children: [{ path: APP_ROUTES.AUTH.LOGIN }, { path: APP_ROUTES.AUTH.REGISTER }],
  },
];
