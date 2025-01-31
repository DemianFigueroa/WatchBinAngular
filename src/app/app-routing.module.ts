import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [AuthGuard], // Apply the AuthGuard here
  },
  {
    path: 'info',
    loadComponent: () => import('./info/info.component').then(m => m.InfoComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [AuthGuard], // Apply the AuthGuard here
  },
  {
    path: 'media-list',
    loadComponent: () =>
      import('./media-list/media-list.component').then((m) => m.MediaListComponent),
  },
  {
    path: 'media/:id',  // Add this route for the media detail page
    loadComponent: () =>
      import('./media-detail/media-detail.component').then((m) => m.MediaDetailComponent),
  },
  {
    path: 'add-media', // Route for adding new media
    loadComponent: () =>
      import('./add-media/add-media.component').then((m) => m.AddMediaComponent),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];