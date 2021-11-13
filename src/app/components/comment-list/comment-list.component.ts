import { Component, Input, OnChanges } from '@angular/core';
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

  userPermissions: UserPermissions

  constructor(
    private authService: AuthService
  ) {
    this.userPermissions = authService.getUserPermissions()
  }

  ngOnChanges() {
    console.log(this.comments)
    console.log(this.userPermissions)
  }

  replyComment(commentID: number) {
    console.log("reply this comment", commentID)
  }

  editComment(commentID: number) {
    console.log('edit comment', commentID)
  }

  deleteComment(commentID: number) {
    console.log('delete comment', commentID)
  }

  editReply(replyID: number) {
    console.log('edit reply', replyID)
  }

  deleteReply(replyID: number) {
    console.log('delete reply', replyID)
  }

}
