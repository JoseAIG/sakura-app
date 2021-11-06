import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MangaPreviewPage } from './manga-preview.page';

const routes: Routes = [
  {
    path: '',
    component: MangaPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangaPreviewPageRoutingModule {}
