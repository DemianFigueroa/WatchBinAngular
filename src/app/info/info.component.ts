import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  imports: [FormsModule, CommonModule, TranslateModule],
})
export class InfoComponent {
  currentLang: string = 'es';

  constructor(private router: Router, private translate: TranslateService) {
    // Set initial language from localStorage or default to English
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  // Change language
  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en'; // Toggle between English and Spanish
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang); // Save language preference
    console.log(`Language changed to ${this.currentLang}`);
  }

  // Navigate to the register page
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Open GitHub links in a new tab
  openGithubFrontend() {
    window.open('https://github.com/your-username/frontend-repo', '_blank');
  }

  openGithubBackend() {
    window.open('https://github.com/your-username/backend-repo', '_blank');
  }
  // Download CV
  downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/cv.pdf'; // Path to your CV file in the assets folder
    link.download = 'Demian-Figueroa.pdf'; // Name of the downloaded file
    link.click();
  }
}