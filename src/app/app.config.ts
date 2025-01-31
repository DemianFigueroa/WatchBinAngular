import { ApplicationConfig, isDevMode } from '@angular/core';
import { routes } from './app-routing.module'; // Adjust the path as necessary
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './auth.guard';
import { provideServiceWorker } from '@angular/service-worker';
import { authInterceptor } from './auth.interceptor';
import { HttpClient } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    CookieService,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: authInterceptor,
      multi: true,
    },
    DatePipe,
    AuthGuard,
    TranslateService,
    TranslateStore,
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
    TranslateService,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
