import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  currentLang: string = 'es';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService,
    private translate: TranslateService
  ) {}

  // Method to handle login form submission
  onLogin() {
    // Password validation logic
    if (!this.validatePassword(this.password)) {
      return; // Stop if password is invalid
    }

    // Password is valid, proceed with the API call
    this.apiService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoggedIn = true;
        this.cookieService.set('jwtToken', response.token, { expires: 7 }); // Set token in cookies for 7 days
        this.errorMessage = ''; // Clear any error messages

        // Redirect to the media list page
        setTimeout(() => {
          this.router.navigate(['/media-list']);
        }, 1000); // 1-second delay to show success message
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage =
          error.error?.message || 'An error occurred while logging in.';
      },
    });
  }

  // Method to navigate to the Register page
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Password validation utility
  private validatePassword(password: string): boolean {
    const passwordRegex = {
      digit: /\d/, // Check for at least one digit
      lowercase: /[a-z]/, // Check for at least one lowercase letter
      uppercase: /[A-Z]/, // Check for at least one uppercase letter
      specialCharacter: /[\W_]/, // Check for at least one special character
    };

    if (password.length < 12) {
      this.errorMessage = 'Password is invalid.';
      return false;
    } else if (!passwordRegex.digit.test(password)) {
      this.errorMessage = 'Password is invalid.';
      return false;
    } else if (!passwordRegex.lowercase.test(password)) {
      this.errorMessage = 'Password is invalid.';
      return false;
    } else if (!passwordRegex.uppercase.test(password)) {
      this.errorMessage = 'Password is invalid.';
      return false;
    } else if (!passwordRegex.specialCharacter.test(password)) {
      this.errorMessage = 'Password is invalid.';
      return false;
    }
    return true;
  }
  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en'; // Toggle between English and Spanish
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang); // Save language preference
  }
}