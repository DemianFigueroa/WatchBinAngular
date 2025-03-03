import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { authInterceptor } from '../auth.interceptor';
import { ApiService } from '../api.service';
import { v4 as uuidv4 } from 'uuid';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-media',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, TranslateModule],
  templateUrl: './add-media.component.html',
  styleUrl: './add-media.component.scss',
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: authInterceptor,
      multi: true,
    },
    DatePipe,
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
    coverImage: '',
  };
  errorMessage: string = '';
  successMessage: string = '';
  isEditing = false;
  mediaId: string | null = null;
  defaultCoverImage = '/assets/default-cover.jpg';

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
        this.media = {
          ...data,
          releaseDate: new Date(data.releaseDate).toISOString().split('T')[0],
          coverImage: data.coverImage,
        };
        this.cdr.detectChanges();
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
    }else{
      this.media.id = uuidv4();
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
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultCoverImage;
  }
}