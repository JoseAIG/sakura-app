import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MangaModalPage } from './manga-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MangaModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangaModalPageRoutingModule {}
