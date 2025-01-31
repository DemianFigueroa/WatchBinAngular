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
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang);
    console.log(`Language changed to ${this.currentLang}`);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  openGithubFrontend() {
    window.open('https://github.com/DemianFigueroa/WatchBinAngular', '_blank');
  }

  openGithubBackend() {
    window.open('https://github.com/DemianFigueroa/WatchBin', '_blank');
  }
  downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/cv.pdf';
    link.download = 'Demian-Figueroa.pdf';
    link.click();
  }
}
