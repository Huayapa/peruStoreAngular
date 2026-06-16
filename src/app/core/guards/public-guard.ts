import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { APP_ROUTES } from '../constants/app-routes';
import { AuthService } from '../services/auth/auth';

export const publicGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const route = inject(Router);
  const snackBar = inject(MatSnackBar);
  if (auth.isLoggedIn()) {
    snackBar.open('Ya tienes una sesión activa', 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'error-snackbar',
    });
    return route.createUrlTree([APP_ROUTES.HOME.ROOT]);
  }
  return true;
};
