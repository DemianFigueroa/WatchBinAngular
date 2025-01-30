import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component'; // Import the LoginComponent
import { AuthInterceptor } from './auth.interceptor'; // Import your interceptor
import { CookieService } from 'ngx-cookie-service';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { DatePipe } from '@angular/common';
import { AddMediaComponent } from './add-media/add-media.component';
import { ServiceWorkerModule } from '@angular/service-worker'; // Import DatePipe

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginComponent,
    MediaDetailComponent,
    HttpClientModule,
    AddMediaComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    CookieService,
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    // Register your interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
