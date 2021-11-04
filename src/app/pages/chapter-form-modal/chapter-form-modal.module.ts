import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChapterFormModalPageRoutingModule } from './chapter-form-modal-routing.module';

import { ChapterFormModalPage } from './chapter-form-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ChapterFormModalPageRoutingModule
  ],
  declarations: [ChapterFormModalPage]
})
export class ChapterFormModalPageModule {}
