import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from '../auth.interceptor'; // Import your interceptor
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; // Import firstValueFrom
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Import CookieService

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
})
export class MediaListComponent implements OnInit {
  mediaList: any[] = [];
  errorMessage: string = '';
  defaultCoverImage = '/default-cover.jpg';
  constructor(private apiService: ApiService, private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    this.fetchMedia();
  }

  fetchMedia() {
    // Initialize mediaList with default images
    this.apiService.getAllMedia().subscribe(
      (response) => {
        this.mediaList = response.map((media) => ({
          ...media,
          coverImageUrl: this.defaultCoverImage, // Set default image initially
        }));

        // Replace default images with actual images after fetching
        this.mediaList.forEach((media) => {
          if (media.coverImage) {
            const img = new Image();
            img.src = media.coverImage;
            img.onload = () => {
              media.coverImageUrl = media.coverImage; // Replace with actual image once loaded
            };
            img.onerror = () => {
              media.coverImageUrl = this.defaultCoverImage; // Fallback to default if actual image fails to load
            };
          }
        });
      },
      (error) => {
        console.error('Error fetching media:', error);
        this.errorMessage = error.error?.message || 'Failed to load media.';
      }
    );
  }

  onImageError(event: any) {
    // If image fails to load, replace it with the default image
    event.target.src = this.defaultCoverImage;
  }
  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.apiService.deleteAccount().subscribe(
        (response) => {
          console.log('Account deleted successfully:', response);
          // Redirect to login page after account deletion
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error deleting account:', error);
          this.errorMessage = 'Failed to delete account. Please try again.';
        }
      );
    }
  }
  // Logout method
  logout(): void {
    this.cookieService.delete('jwtToken'); // Remove the token cookie
    this.router.navigate(['/login']); // Redirect to login page
  }
}