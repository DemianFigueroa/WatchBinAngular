import { Component } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { authInterceptor } from './auth.interceptor'; // Import authInterceptor
import { TopBarComponent } from './top-bar/top-bar.component'; // Import TopBarComponent
import { Router, RouterOutlet } from '@angular/router'; // Import Router and RouterOutlet
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // Mark as standalone
  imports: [TopBarComponent, RouterOutlet, FormsModule, CommonModule], // Import TopBarComponent and RouterOutlet
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: authInterceptor,
      multi: true, // Add the interceptor to the chain
    },
    DatePipe,
  ],
})
export class AppComponent {
  constructor(private router: Router) {} // Inject the Router service

  shouldShowTopBar(): boolean {
    return (
      !this.router.url.startsWith('/login') &&
      !this.router.url.startsWith('/register') &&
      !this.router.url.startsWith('/info')
    );
  }
}