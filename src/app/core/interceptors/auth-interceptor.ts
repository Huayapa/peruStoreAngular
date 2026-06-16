import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (req.context.get(SKIP_AUTH) || !token) return next(req);
  const headers = req.headers.set('Authorization', token.token);
  return next(req.clone({ headers }));
};
