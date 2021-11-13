import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentListComponent } from './comment-list.component';
import { CommentComponentModule } from '../comment/comment.module';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, CommentComponentModule],
  declarations: [CommentListComponent],
  exports: [CommentListComponent]
})
export class CommentListComponentModule {}
