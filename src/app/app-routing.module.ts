import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
