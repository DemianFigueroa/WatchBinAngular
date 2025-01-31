import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { authInterceptor } from '../auth.interceptor';
import { CommonModule, DatePipe } from '@angular/common';
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
      multi: true,
    },
    DatePipe
  ]
})
export class MediaDetailComponent implements OnInit {
  media: any;
  errorMessage: string = '';
  defaultCoverImage = '/default-cover.jpg';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const mediaId = params['id'];
      this.fetchMediaDetails(mediaId);
    });
  }

  fetchMediaDetails(id: string): void {
    this.apiService.getMediaById(id).subscribe(
      (response) => {
        this.media = {
          ...response,
          coverImageUrl: this.defaultCoverImage,
        };
        if (response.coverImage) {
          const img = new Image();
          img.src = response.coverImage;
          img.onload = () => {
            this.media.coverImageUrl = response.coverImage;
          };
          img.onerror = () => {
            this.media.coverImageUrl = this.defaultCoverImage;
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
    event.target.src = this.defaultCoverImage;
  }

  confirmDelete(): void {
    const confirmMessage = this.translate.instant('mediaDetail.deleteMediaConfirmation', {
      name: this.media?.name,
    });
  
    if (confirm(confirmMessage)) {
      this.apiService.deleteMedia(this.media.id).subscribe(
        () => {
          this.router.navigate(['/media-list']);
        },
        (error) => {
          console.error('Error deleting media:', error);
          this.errorMessage = this.translate.instant('errors.deleteMedia');
        }
      );
    }
  }
  formatReleaseDate(date: string): string {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const monthTranslationKey = `date.months.${monthIndex}`;
    const monthName = this.translate.instant(monthTranslationKey);
    return `${day} ${monthName} ${year}` || 'Invalid date';
  }

}