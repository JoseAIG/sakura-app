import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentsPageRoutingModule } from './comments-routing.module';

import { CommentsPage } from './comments.page';
import { CommentListComponentModule } from 'src/app/components/comment-list/comment-list.module';
import { CommentInputComponentModule } from 'src/app/components/comment-input/comment-input.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentsPageRoutingModule,
    CommentListComponentModule,
    CommentInputComponentModule
  ],
  declarations: [CommentsPage]
})
export class CommentsPageModule {}
