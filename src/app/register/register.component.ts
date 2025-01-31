import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  id: string = '';
  errorMessage: string = '';
  currentLang: string = 'es';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService,
    private translate: TranslateService
  ) {}

  // Method to handle registration form submission
  onSubmit() {
    // Password validation logic
    if (!this.validatePassword(this.password)) {
      return; // Stop if password is invalid
    }

    // Password is valid, proceed with the API call
    this.apiService.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.errorMessage = ''; // Clear any error messages

        // Optionally, set a cookie or token if the API returns one
        if (response.token) {
          this.cookieService.set('jwtToken', response.token, { expires: 7 }); // Set token in cookies for 7 days
        }

        // Redirect to the media list page after successful registration
        this.router.navigate(['/media-list']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage =
          error.error?.message || 'An error occurred while registering.';
      },
    });
  }

  // Method to navigate to the Login page
  goToLogin() {
    this.router.navigate(['/login']);
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
      this.errorMessage = 'Password must be at least 12 characters long.';
      return false;
    } else if (!passwordRegex.digit.test(password)) {
      this.errorMessage = 'Password must contain at least one digit.';
      return false;
    } else if (!passwordRegex.lowercase.test(password)) {
      this.errorMessage = 'Password must contain at least one lowercase letter.';
      return false;
    } else if (!passwordRegex.uppercase.test(password)) {
      this.errorMessage = 'Password must contain at least one uppercase letter.';
      return false;
    } else if (!passwordRegex.specialCharacter.test(password)) {
      this.errorMessage = 'Password must contain at least one special character.';
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