import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from '../auth.interceptor';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
      HttpClient,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor,
         multi: true
      }
    ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  constructor(private apiService: ApiService, private router: Router, private cookieService: CookieService) {} // Inject Router and CookieService

  // Method to handle login form submission
  onLogin() {
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
      this.apiService.login(this.username, this.password).subscribe(
        (response) => {
          console.log('Login successful:', response);
          this.isLoggedIn = true;
          this.cookieService.set('jwtToken', response.token, { expires: 7 }); // Set token in cookies for 7 days
          this.errorMessage = ''; // Clear any error messages

          // Redirect to the media list page
          setTimeout(() => {
            this.router.navigate(['/media-list']);
          }, 1000); // 1-second delay to show success message
        },
        (error) => {
          console.error('Login error:', error);
          // Access the error message from the response
          this.errorMessage =
            error.error?.message || 'An error occurred while logging in.';
        }
      );
    }
  }

  // Method to navigate to the Register page
  goToRegister() {
    this.router.navigate(['/register']);
  }
  
}
