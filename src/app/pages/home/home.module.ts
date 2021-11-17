import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MangaCarouselComponentModule } from 'src/app/components/manga-carousel/manga-carousel.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    MangaCarouselComponentModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
