import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { authInterceptor } from '../auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, TranslateModule],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: authInterceptor,
      multi: true,
    },
  ],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
})
export class MediaListComponent implements OnInit {
  mediaList: any[] = [];
  filteredMediaList: any[] = [];
  errorMessage: string = '';
  defaultCoverImage = '/default-cover.jpg';
  searchTerm: string = '';
  filterCriteria: string = 'all';
  currentLang: string = 'es';

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.fetchMedia();
  }

  fetchMedia() {
    this.apiService.getAllMedia().subscribe(
      (response) => {
        this.mediaList = response.map((media) => ({
          ...media,
          coverImageUrl: this.defaultCoverImage,
        }));

        this.mediaList.forEach((media) => {
          if (media.coverImage) {
            const img = new Image();
            img.src = media.coverImage;
            img.onload = () => {
              media.coverImageUrl = media.coverImage;
            };
            img.onerror = () => {
              media.coverImageUrl = this.defaultCoverImage;
            };
          }
        });

        this.filteredMediaList = this.mediaList;
      },
      (error) => {
        console.error('Error fetching media:', error);
        this.errorMessage = error.error?.message || 'Failed to load media.';
        this.cookieService.delete('jwtToken');
        this.router.navigate(['/login']);
      }
    );
  }

  onImageError(event: any) {
    event.target.src = this.defaultCoverImage;
  }

  onSearchChange() {
    this.filterMedia();
  }

  onFilterChange() {
    this.filterMedia();
  }

  filterMedia() {
    this.filteredMediaList = this.mediaList.filter((media) => {
      const matchesSearch = media.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());

      let matchesFilter = true;
      if (this.filterCriteria === 'Completed') {
        matchesFilter = media.status === true; // Filter by completed status
      } else if (this.filterCriteria === 'Uncompleted') {
        matchesFilter = media.status === false; // Filter by uncompleted status
      } else if (this.filterCriteria !== 'all') {
        matchesFilter = media.type === this.filterCriteria; // Check for Show or Movie
      }
      return matchesSearch && matchesFilter;
    });
  }
  changeLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en'; // Toggle between English and Spanish
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang); // Save language preference
  }
}