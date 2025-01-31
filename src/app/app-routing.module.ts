import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./info/info.component').then((m) => m.InfoComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'media-list',
    loadComponent: () =>
      import('./media-list/media-list.component').then(
        (m) => m.MediaListComponent
      ),
  },
  {
    path: 'media/:id',
    loadComponent: () =>
      import('./media-detail/media-detail.component').then(
        (m) => m.MediaDetailComponent
      ),
  },
  {
    path: 'add-media',
    loadComponent: () =>
      import('./add-media/add-media.component').then(
        (m) => m.AddMediaComponent
      ),
  },
  { path: '', redirectTo: '/info', pathMatch: 'full' },
];
