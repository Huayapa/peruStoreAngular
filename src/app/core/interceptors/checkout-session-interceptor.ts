import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CheckoutSessionService } from '../services/checkout-session';

export const SKIP_SESSION = new HttpContextToken<boolean>(() => false);

export const checkoutSessionInterceptorFn: HttpInterceptorFn = (req, next) => {
  const checkoutSession = inject(CheckoutSessionService);
  const sessionToken = checkoutSession.getToken();
  if (!sessionToken || req.context.get(SKIP_SESSION)) return next(req);
  const headers = req.headers.set('x-session-token', sessionToken);
  return next(req.clone({ headers }));
};
