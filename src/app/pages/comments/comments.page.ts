import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/interfaces/comment';
import { CommentService } from 'src/app/services/comment.service';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  @Input() chapterID: number

  chapterComments: Comment[]
  reply: {commentID: number, username: string}

  constructor(
    private controllerService: ControllerService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.getChapterComments()
  }

  async dismiss() {
    await this.controllerService.dismissModal({
      'dismissed': true
    })
  }

  doRefresh(event: any) {
    this.getChapterComments()
    event.target.complete();
  }

  async getChapterComments() {
    const loading = await this.controllerService.createLoading();
    await loading.present();
    
    this.commentService.getChapterComments(this.chapterID)
      .subscribe(
        async (res: { status: number, chapterComments: Comment[] }) => {
          this.chapterComments = res.chapterComments
          console.log(this.chapterComments)
          await loading.dismiss()
        },
        async (res) => {
          console.log(res.error)
          await loading.dismiss()
        }
      )
  }

  replyComment(comment: {commentID: number, username: string}) {
    this.reply = comment
  }

}
