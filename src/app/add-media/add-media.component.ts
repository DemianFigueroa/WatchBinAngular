import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthInterceptor } from '../auth.interceptor';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-add-media',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './add-media.component.html',
  styleUrl: './add-media.component.scss',
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe, // Add DatePipe to the providers array
  ],
})
export class AddMediaComponent implements OnInit {
  media: any = {
    id: '',
    name: '',
    type: '',
    creator: '',
    releaseDate: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    status: false,
    coverImageUrl: '',
  };
  errorMessage: string = '';
  successMessage: string = '';
  isEditing = false;
  mediaId: string | null = null;
  defaultCoverImage = '/default-cover.jpg';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.mediaId = params['id'];
        this.isEditing = true;
        if (this.mediaId) {
          this.fetchMediaDetails(this.mediaId);
        }
      }
    });
  }

  fetchMediaDetails(id: string): void {
    this.apiService.getMediaById(id).subscribe(
      (data) => {
        // Directly assign the API response to the media object
        this.media = {
          ...data,
          releaseDate: new Date(data.releaseDate).toISOString().split('T')[0],
          coverImageUrl: data.coverImageUrl, // Use the image URL from the API
        };
        this.cdr.detectChanges(); // Force change detection
      },
      (error) => {
        this.errorMessage = 'Error loading media data.';
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    if (this.isEditing && this.mediaId) {
      this.media.id = this.mediaId;
    }

    this.apiService.addMedia(this.media).subscribe(
      () => {
        this.router.navigate(['/media-list']);
      },
      (error) => {
        this.errorMessage = this.isEditing
          ? 'Error updating media.'
          : 'Error adding media.';
        console.error(error);
      }
    );
  }
}