import { Component } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { authInterceptor } from './auth.interceptor';
import { TopBarComponent } from './top-bar/top-bar.component';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopBarComponent, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: authInterceptor,
      multi: true,
    },
    DatePipe,
  ],
})
export class AppComponent {
  constructor(private router: Router) {}

  shouldShowTopBar(): boolean {
    return (
      !this.router.url.startsWith('/login') &&
      !this.router.url.startsWith('/register') &&
      !this.router.url.startsWith('/info')
    );
  }
}
