import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorePage } from './explore.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter'

import { ExplorePageRoutingModule } from './explore-routing.module';
import { MangaCardComponentModule } from 'src/app/components/manga-card/manga-card.module';
import { MangaListComponentModule } from 'src/app/components/manga-list/manga-list.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExplorePageRoutingModule,
    MangaCardComponentModule,
    MangaListComponentModule,
    Ng2SearchPipeModule
  ],
  declarations: [ExplorePage]
})
export class ExplorePageModule {}
