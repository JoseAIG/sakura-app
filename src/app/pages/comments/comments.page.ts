import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Comment } from 'src/app/interfaces/comment';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  @Input() chapterID: number

  chapterComments: Comment[]

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.getChapterComments()
  }

  async dismiss() {
    await this.modalController.dismiss({
      'dismissed': true
    })
  }

  doRefresh(event: any) {
    this.getChapterComments()
    event.target.complete();
  }

  async getChapterComments() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.commentService.getChapterComments(this.chapterID)
      .subscribe(
        async (res: { status: number, chapterComments: Comment[] }) => {
          this.chapterComments = res.chapterComments
          await loading.dismiss()
        },
        async (res) => {
          console.log(res.error)
          await loading.dismiss()
        }
      )
  }

}
