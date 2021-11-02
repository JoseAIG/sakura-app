import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangaModalPageRoutingModule } from './manga-modal-routing.module';

import { MangaModalPage } from './manga-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MangaModalPageRoutingModule
  ],
  declarations: [MangaModalPage]
})
export class MangaModalPageModule {}
