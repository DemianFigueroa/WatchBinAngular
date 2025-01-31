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
    // Set initial language from localStorage or default to English
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  // Navigate to the home page
  goHome() {
    this.router.navigate(['/media-list']);
  }

  // Logout the user
  logout(): void {
    this.cookieService.delete('jwtToken');
    this.router.navigate(['/login']);
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.apiService.deleteAccount().subscribe(
        (response) => {
          console.log('Account deleted successfully:', response);
          this.logout(); // Logout the user after deleting the account
        },
        (error) => {
          console.error('Error deleting account:', error);
          this.errorMessage = 'Failed to delete account. Please try again.';
        }
      );
    }
  }

  // Toggle the hamburger menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en'; // Toggle between English and Spanish
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang); // Save language preference
  }
  // Navigate to the info screen
  goToInfo() {
    this.router.navigate(['/info']); // Replace '/info' with the actual route for your info screen
  }
}