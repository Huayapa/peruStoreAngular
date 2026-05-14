import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { APP_ROUTES } from '../constants/app-routes';
import { MatSnackBar } from '@angular/material/snack-bar';

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
