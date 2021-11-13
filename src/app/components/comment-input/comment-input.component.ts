import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
})
export class CommentInputComponent implements OnInit {

  @Input() chapterID: number

  @Output() refresh = new EventEmitter<boolean>();

  userPermissions: UserPermissions
  newComment: string

  constructor(
    private authService: AuthService,
    private commentService: CommentService,
    private toastController: ToastController
  ) {
    this.userPermissions = authService.getUserPermissions()
  }

  ngOnInit() { }

  postComment() {
    this.commentService.createComment(this.chapterID, this.newComment)
      .subscribe(
        async (res: {status: number, message: string}) => {
          const toast = await this.toastController.create({
            message: res.message,
            duration: 2000
          });
          await toast.present();
          this.refresh.emit(true)
        },
        async (res) => {
          const toast = await this.toastController.create({
            message: `Error: ${res.error.message}`,
            duration: 2000
          });
          await toast.present();
        }
      )
  }

}
