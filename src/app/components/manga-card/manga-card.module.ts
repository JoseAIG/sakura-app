import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangaCardComponent } from './manga-card.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [MangaCardComponent],
  exports: [MangaCardComponent]
})
export class MangaCardComponentModule {}
