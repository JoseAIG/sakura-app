import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChapterFormModalPage } from './chapter-form-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChapterFormModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChapterFormModalPageRoutingModule {}
