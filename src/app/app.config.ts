import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(),
  // Register PrimeNG with default configuration. We avoid importing a theme preset
  // here to prevent bundlers (vite) from pulling deep internal primeng subpaths
  // that may cause resolution issues in some environments.
  providePrimeNG({
            theme: {
                preset: Aura
            }
        })
  ] 
};
