import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorApiInterceptorFn } from './core/interceptors/error-api-interceptor';
import { checkoutSessionInterceptorFn } from './core/interceptors/checkout-session-interceptor';
import { cacheInterceptorFn } from './core/interceptors/cache-interceptor';
import { authInterceptorFn } from './core/interceptors/auth-interceptor/auth-interceptor';

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
