import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { faHome, faInfoCircle, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslateModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  errorMessage: string = '';
  faHome = faHome;
  faLanguage = faLanguage;
  faInfoCircle = faInfoCircle;
  isMenuOpen = false;
  currentLang: string = 'es';
  constructor(private router: Router, private apiService: ApiService, private cookieService: CookieService, private translate: TranslateService) {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  goHome() {
    this.router.navigate(['/media-list']);
  }

  logout(): void {
    this.cookieService.delete('jwtToken');
    this.router.navigate(['/login']);
  }

  deleteAccount(): void {
    const confirmMessage = this.translate.instant('account.deleteConfirmation');
    if (confirm(confirmMessage)) {
      this.apiService.deleteAccount().subscribe(
        (response) => {
          console.log('Account deleted successfully:', response);
          this.logout();
        },
        (error) => {
          console.error('Error deleting account:', error);
          this.errorMessage = this.translate.instant('errors.deleteAccount');
        }
      );
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang);
  }
  goToInfo() {
    this.router.navigate(['/info']);
  }
}