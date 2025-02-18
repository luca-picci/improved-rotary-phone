import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideNgxWebstorage, withNgxWebstorageConfig, withLocalStorage, withSessionStorage } from 'ngx-webstorage';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './app/interceptors/jwtinterceptor';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const storageConfig = {
  separator: ':',
  caseSensitive: true,
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Usa le rotte definite in `app.routes.ts`
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideNgxWebstorage(
      withNgxWebstorageConfig(storageConfig),
      withLocalStorage(),
      withSessionStorage()
    ), provideAnimationsAsync(),
  ],
}).catch((err) => console.error(err));
