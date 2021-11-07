import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter'

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { MangaCardComponentModule } from 'src/app/components/manga-card/manga-card.module';
import { MangaListComponentModule } from 'src/app/components/manga-list/manga-list.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    MangaCardComponentModule,
    MangaListComponentModule,
    Ng2SearchPipeModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
