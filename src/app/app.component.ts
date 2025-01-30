import { Component } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';  // Import AuthInterceptor
import { DatePipe } from '@angular/common'; // Import DatePipe

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Fixed typo here, 'styleUrl' -> 'styleUrls'
  standalone: false,  // Make sure this is false to make AppComponent part of a module
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,  // Add the interceptor to the chain
    }, DatePipe
  ],
})
export class AppComponent {
  title = 'WatchBinAngular';
}
