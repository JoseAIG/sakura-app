import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from 'src/app/interfaces/comment';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment

  @Output() refresh = new EventEmitter<boolean>();

  userPermissions: UserPermissions

  constructor(
    private authService: AuthService,
    private commentService: CommentService,
    private controllerService: ControllerService
  ) {
    this.userPermissions = authService.getUserPermissions()
  }

  ngOnInit() {
    console.log('comment', this.comment)
  }

  replyComment(commentID: number) {
    console.log("reply this comment", commentID)
  }

  async editCommentAlert(commentID: number, content: string) {
    const editCommentAlert = await this.controllerService.createAlert({
      header: "Edit comment",
      inputs: [
        {
          type: 'text',
          value: content
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.editComment(commentID, data[0])
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel'
        }
      ]
    });
    await editCommentAlert.present()
  }

  editComment(commentID: number, content: string) {
    this.commentService.editComment(commentID, content)
      .subscribe(
        async (res: { status: number, message: string }) => {
          const toast = await this.controllerService.createToast({
            message: res.message,
            duration: 2000
          });
          await toast.present();
          this.refresh.emit(true)
        },
        async (res) => {
          const toast = await this.controllerService.createToast({
            message: `Error: ${res.error.message}`,
            duration: 2000
          });
          await toast.present();
        }
      )
  }

  async confirmCommentDeletion(commentID: number) {
    const alert = await this.controllerService.createAlert({
      header: 'Delete comment?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deleteComment(commentID)
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel'
        }
      ],
    });
    await alert.present();
  }

  deleteComment(commentID: number) {
    this.commentService.deleteComment(commentID)
      .subscribe(
        async (res: { status: number, message: string }) => {
          const toast = await this.controllerService.createToast({
            message: res.message,
            duration: 2000
          });
          await toast.present();
          this.refresh.emit(true)
        },
        async (res) => {
          const toast = await this.controllerService.createToast({
            message: `Error: ${res.error.message}`,
            duration: 2000
          });
          await toast.present();
        }
      )
  }

  editReply(replyID: number) {
    console.log('edit reply', replyID)
  }

  deleteReply(replyID: number) {
    console.log('delete reply', replyID)
  }

}
