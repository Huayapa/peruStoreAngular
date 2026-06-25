import { HttpContextToken, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { filter, of, tap } from 'rxjs';

export const HANDLE_CACHE_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const cache = new Map<string, { response: HttpResponse<unknown>; expiresAt: number }>();
export const TTL_MS = 5 * 60 * 1000;

export const cacheInterceptorFn: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.context.get(HANDLE_CACHE_INTERCEPTOR)) {
    return next(req);
  }

  const entry = cache.get(req.urlWithParams);
  if (entry && Date.now() < entry.expiresAt) {
    return of(entry.response.clone());
  }

  return next(req).pipe(
    filter((event) => event instanceof HttpResponse),
    tap((reshttp) => {
      cache.set(req.urlWithParams, {
        response: reshttp.clone(),
        expiresAt: Date.now() + TTL_MS,
      });
    }),
  );
};
