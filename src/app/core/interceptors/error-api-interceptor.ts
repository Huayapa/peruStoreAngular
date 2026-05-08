import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const HANDLE_HTTP_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const errorApiInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  if (!req.context.get(HANDLE_HTTP_INTERCEPTOR)) return next(req);
  const opts: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: 3000,
    panelClass: 'error-snackbar',
  };

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      snackBar.open(messageStatus[err.status] ?? 'Ha ocurrido un error inesperado', 'Cerrar', opts);
      return throwError(() => err);
    }),
  );
};

const messageStatus: Record<number, string> = {
  [HttpStatusCode.Unauthorized]: 'No autorizado',
  [HttpStatusCode.Forbidden]: 'Acceso denegado',
  [HttpStatusCode.NotFound]: 'Recurso no encontrado',
  [HttpStatusCode.InternalServerError]: 'Error interno del servidor',
};
