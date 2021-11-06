import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangaPreviewPageRoutingModule } from './manga-preview-routing.module';

import { MangaPreviewPage } from './manga-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangaPreviewPageRoutingModule
  ],
  declarations: [MangaPreviewPage]
})
export class MangaPreviewPageModule {}
