import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MangaListComponent } from './manga-list.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [MangaListComponent],
  exports: [MangaListComponent]
})
export class MangaListComponentModule {}
