import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from '../auth.interceptor';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService

@Component({
  selector: 'app-register',
  standalone: true, // Add standalone: true
  imports: [FormsModule, CommonModule], // Move imports here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService // Inject CookieService
  ) {}

  // Method to handle registration form submission
  onSubmit() {
    // Password validation logic
    const passwordRegex = {
      digit: /\d/, // Check for at least one digit
      lowercase: /[a-z]/, // Check for at least one lowercase letter
      uppercase: /[A-Z]/, // Check for at least one uppercase letter
      specialCharacter: /[\W_]/, // Check for at least one special character
    };

    // Check if password meets all requirements
    if (this.password.length < 12) {
      this.errorMessage = 'Password must be at least 12 characters long.';
    } else if (!passwordRegex.digit.test(this.password)) {
      this.errorMessage = 'Password must contain at least one digit.';
    } else if (!passwordRegex.lowercase.test(this.password)) {
      this.errorMessage = 'Password must contain at least one lowercase letter.';
    } else if (!passwordRegex.uppercase.test(this.password)) {
      this.errorMessage = 'Password must contain at least one uppercase letter.';
    } else if (!passwordRegex.specialCharacter.test(this.password)) {
      this.errorMessage = 'Password must contain at least one special character.';
    } else {
      // Password is valid, proceed with the API call
      this.apiService.register(this.username, this.email, this.password).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.errorMessage = ''; // Clear any error messages

          // Optionally, set a cookie or token if the API returns one
          if (response.token) {
            this.cookieService.set('jwtToken', response.token, { expires: 7 }); // Set token in cookies for 7 days
          }

          // Redirect to the login page after successful registration
          this.router.navigate(['/media-list']);
        },
        (error) => {
          console.error('Registration error:', error);
          this.errorMessage = error.error?.message || 'An error occurred while registering.';
        }
      );
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}