import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { unwrapResponseInterceptor } from './core/interceptors/unwrap-response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // anchorScrolling: sin esto los [fragment] del navbar navegan pero no hacen scroll
    // a la sección del producto. Los targets ya traen scroll-mt-* para el navbar fijo.
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, unwrapResponseInterceptor])),
  ],
};
