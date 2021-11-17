import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialShareComponent } from './social-share.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [SocialShareComponent],
  exports: [SocialShareComponent]
})
export class SocialShareComponentModule{}
