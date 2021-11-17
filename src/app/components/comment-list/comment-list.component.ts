import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Comment } from 'src/app/interfaces/comment';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnChanges {

  @Input() comments: Comment[]

  @Output() refresh = new EventEmitter<boolean>();
  @Output() reply = new EventEmitter<{commentID: number, username: string}>()

  userPermissions: UserPermissions

  constructor(private authService: AuthService) {
    this.userPermissions = this.authService.getUserPermissions()
  }

  ngOnChanges() { }
  
  doRefresh(){
    this.refresh.emit(true)
  }

  replyComment(comment: {commentID: number, username: string}){
    this.reply.emit(comment)
  }
}
