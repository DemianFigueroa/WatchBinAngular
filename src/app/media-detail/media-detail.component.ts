import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { authInterceptor } from '../auth.interceptor';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-media-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, TranslateModule],
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.scss'],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: authInterceptor,
      multi: true, // Add the interceptor to the chain
    },
    DatePipe // Add DatePipe to the providers array
  ]
})
export class MediaDetailComponent implements OnInit {
  media: any;
  errorMessage: string = '';
  defaultCoverImage = '/default-cover.jpg';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe, // Inject DatePipe
    private http: HttpClient, // Inject HttpClient
    private router: Router, // Inject Router
    private translate: TranslateService // Inject TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const mediaId = params['id']; // Get the media id from the URL
      this.fetchMediaDetails(mediaId);
    });
  }

  fetchMediaDetails(id: string): void {
    this.apiService.getMediaById(id).subscribe(
      (response) => {
        // Initialize with the default image
        this.media = {
          ...response,
          coverImageUrl: this.defaultCoverImage, // Set default image initially
        };

        // Load the actual image in the background
        if (response.coverImage) {
          const img = new Image();
          img.src = response.coverImage;
          img.onload = () => {
            this.media.coverImageUrl = response.coverImage; // Replace with actual image once loaded
          };
          img.onerror = () => {
            this.media.coverImageUrl = this.defaultCoverImage; // Fallback to default if actual image fails to load
          };
        }
      },
      (error) => {
        console.error('Error fetching media details:', error);
        this.errorMessage = error.error?.message || 'Failed to load media details.';
      }
    );
  }

  onImageError(event: any) {
    // If image fails to load, replace it with the default image
    event.target.src = this.defaultCoverImage;
  }

  confirmDelete(): void {
    if (confirm(`Are you sure you want to delete "${this.media?.name}"?`)) {
      this.apiService.deleteMedia(this.media.id).subscribe(
        () => {
          this.router.navigate(['/media-list']); // Navigate back to media list
        },
        (error) => {
          console.error('Error deleting media:', error);
          this.errorMessage = error.error?.message || 'Failed to delete media.';
        }
      );
    }
  }
  // Custom method to format the release date
  formatReleaseDate(date: string): string {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    // Get the translated month name based on the locale
    const monthTranslationKey = `date.months.${monthIndex}`;
    const monthName = this.translate.instant(monthTranslationKey);

    return `${day} ${monthName} ${year}` || 'Invalid date';
  }

}