import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptorFn } from './core/interceptors/auth-interceptor/auth-interceptor';
import { cacheInterceptorFn } from './core/interceptors/cache-interceptor/cache-interceptor';
import { errorApiInterceptorFn } from './core/interceptors/error-api-interceptor/error-api-interceptor';
import { checkoutSessionInterceptorFn } from './core/interceptors/checkout-session-interceptor/checkout-session-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        errorApiInterceptorFn,
        authInterceptorFn,
        checkoutSessionInterceptorFn,
        cacheInterceptorFn,
      ]),
    ),
    provideLottieOptions({ player: () => import('lottie-web') }),
    provideCacheableAnimationLoader(),
  ],
};
