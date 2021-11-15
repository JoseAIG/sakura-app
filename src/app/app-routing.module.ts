import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';
import { LoginGuard } from './guards/login.guard';
import { RegisterGuard } from './guards/register.guard';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule),
    canLoad: [IntroGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [LoginGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canLoad: [RegisterGuard]
  },
  {
    path: 'user-modal',
    loadChildren: () => import('./pages/user-modal/user-modal.module').then( m => m.UserModalPageModule)
  },
  {
    path: 'manga-modal',
    loadChildren: () => import('./pages/manga-modal/manga-modal.module').then( m => m.MangaModalPageModule)
  },
  {
    path: 'chapter-form-modal',
    loadChildren: () => import('./pages/chapter-form-modal/chapter-form-modal.module').then( m => m.ChapterFormModalPageModule)
  },
  {
    path: 'manga-preview',
    loadChildren: () => import('./pages/manga-preview/manga-preview.module').then( m => m.MangaPreviewPageModule)
  },
  {
    path: 'viewer',
    loadChildren: () => import('./pages/viewer/viewer.module').then( m => m.ViewerPageModule)    
  },
  {
    path: 'comments',
    loadChildren: () => import('./pages/comments/comments.module').then( m => m.CommentsPageModule)
  },
  {
    path: '',
    redirectTo: '/intro',
    pathMatch: 'full'
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
