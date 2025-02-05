import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNgxWebstorage, withNgxWebstorageConfig, withLocalStorage, withSessionStorage } from 'ngx-webstorage';

import { routes } from './app.routes';

const storageConfig = {
  separator: ':',
  caseSensitive: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideNgxWebstorage(
      withNgxWebstorageConfig(storageConfig),
      withLocalStorage(),
      withSessionStorage()
    ),
  ],
};
