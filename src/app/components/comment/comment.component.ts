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
  @Output() reply = new EventEmitter<{ commentID: number, username: string }>()

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

  replyComment(commentID: number, username: string) {
    this.reply.emit({ commentID: commentID, username: username })
  }

  async editAlert(reply: boolean, id: number, content: string) {
    const editAlert = await this.controllerService.createAlert({
      header: reply ? "Edit reply" : "Edit comment",
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
            if(reply){
              this.editReply(id, data[0])
            }else{
              this.editComment(id, data[0])
            }
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel'
        }
      ]
    });
    await editAlert.present()
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

  async confirmDeletion(reply: boolean, id: number) {
    const alert = await this.controllerService.createAlert({
      header: reply ? 'Delete reply?' : 'Delete comment?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (reply) {
              this.deleteReply(id)
            } else {
              this.deleteComment(id)
            }
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

  editReply(replyID: number, content: string) {
    this.commentService.editReply(replyID, content)
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

  deleteReply(replyID: number) {
    this.commentService.deleteReply(replyID)
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

}
