import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';
import { MangaCardComponentModule } from 'src/app/components/manga-card/manga-card.module';

import { ProfilePageRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ProfilePage }]),
    ProfilePageRoutingModule,
    MangaCardComponentModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
