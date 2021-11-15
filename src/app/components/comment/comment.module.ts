import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentComponent } from './comment.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [CommentComponent],
  exports: [CommentComponent]
})
export class CommentComponentModule {}
