import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateCompiler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler'; // Optional, for advanced features
import { AppComponent } from './app/app.component'; // Your root standalone component
import { routes } from './app/app-routing.module'; // Import your routes
import { AuthGuard } from './app/auth.guard'; // Import AuthGuard
import { authInterceptor } from './app/auth.interceptor'; // Import the functional interceptor

// AoT requires an exported function for the HttpLoaderFactory
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]) // Provide the functional interceptor here
    ),
    provideRouter(routes, withComponentInputBinding()), // Configure the router
    AuthGuard, // Provide AuthGuard
    ...(TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler, // Optional, for advanced features
      },
    }).providers || []),
  ],
}).catch((err) => console.error(err));
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'es');
}