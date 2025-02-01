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
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService,
    private translate: TranslateService
  ) {}

  onSubmit() {
    if (!this.validatePassword(this.password)) {
      return;
    }
    this.isLoading = true;
    this.apiService
      .register(this.username, this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.errorMessage = '';

          if (response.token) {
            this.cookieService.set('jwtToken', response.token, { expires: 7 });
          }

          this.router.navigate(['/media-list']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage =
            error.error?.message || 'An error occurred while registering.';
        },
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex = {
      digit: /\d/,
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      specialCharacter: /[\W_]/,
    };

    if (password.length < 12) {
      this.errorMessage = this.translate.instant('errors.passwordLength');
      return false;
    } else if (!passwordRegex.digit.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordDigit');
      return false;
    } else if (!passwordRegex.lowercase.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordLowercase');
      return false;
    } else if (!passwordRegex.uppercase.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordUppercase');
      return false;
    } else if (!passwordRegex.specialCharacter.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordSpecialChar');
      return false;
    }
    return true;
  }
  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang);
  }
}
