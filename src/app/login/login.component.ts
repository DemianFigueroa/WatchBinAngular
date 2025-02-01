import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
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
  isLoading: boolean = false;
  currentLang: string = 'es';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService,
    private translate: TranslateService
  ) {}

  onLogin() {
    if (!this.validatePassword(this.password)) {
      return;
    }
    this.isLoading = true;
    this.apiService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        this.isLoggedIn = true;
        this.cookieService.set('jwtToken', response.token, { expires: 7 });
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/media-list']);
        }, 1000);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage =
          error.error?.message || 'An error occurred while logging in.';
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex = {
      digit: /\d/,
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      specialCharacter: /[\W_]/,
    };

    if (password.length < 12) {
      this.errorMessage = this.translate.instant('errors.passwordInvalid');
      return false;
    } else if (!passwordRegex.digit.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordInvalid');
      return false;
    } else if (!passwordRegex.lowercase.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordInvalid');
      return false;
    } else if (!passwordRegex.uppercase.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordInvalid');
      return false;
    } else if (!passwordRegex.specialCharacter.test(password)) {
      this.errorMessage = this.translate.instant('errors.passwordInvalid');
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
