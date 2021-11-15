import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chapter } from 'src/app/interfaces/chapter';
import { Manga } from 'src/app/interfaces/manga';
import { AuthService } from 'src/app/services/auth.service';
import { ControllerService } from 'src/app/services/controller.service';
import { MangaService } from 'src/app/services/manga.service';
import { ChapterFormModalPage } from '../chapter-form-modal/chapter-form-modal.page';
import { MangaModalPage } from '../manga-modal/manga-modal.page';

@Component({
  selector: 'app-manga-preview',
  templateUrl: './manga-preview.page.html',
  styleUrls: ['./manga-preview.page.scss'],
})
export class MangaPreviewPage implements OnInit {

  @Input() manga: Manga
  @Input() chapter: Chapter

  userPermissions: object
  color:string

  constructor(
    private controllerService: ControllerService,
    private mangaService: MangaService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userPermissions = authService.getUserPermissions()
  }

  ngOnInit() {
    this.getState()
   }

  getMangaData() {
    this.mangaService.getManga(this.manga.manga_id)
      .subscribe(
        async (res: Manga) => {
          this.manga = res
        }
      )
  }

  async dismiss() {
    await this.controllerService.dismissModal({
      'dismissed': true
    })
  }

  async editManga() {
    const modal = await this.controllerService.createModal({
      component: MangaModalPage,
      componentProps: {
        edit: true,
        manga: this.manga
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getMangaData()
    }
  }


  async editChapter(chapter: Chapter) {
    const modal = await this.controllerService.createModal({
      component: ChapterFormModalPage,
      componentProps: {
        edit: true,
        'mangaToEdit': this.manga,
        'chapter': chapter
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getMangaData()
    }
  }

  async createChapter() {
    const modal = await this.controllerService.createModal({
      component: ChapterFormModalPage,
      componentProps: {
        edit: false,
        mangas: [this.manga]
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getMangaData();
    }
  }

  openViewer(manga: Manga, chapterNumber: number) {
    this.router.navigate(['viewer'], { queryParams: { title: manga.title, mangaID: manga.manga_id, chapterNumber: chapterNumber, backURL: this.router.url } })
    this.dismiss()
  }

  //return manga chip color by state
  getState() {
    if (this.manga.status == "Ongoing") {
      return this.color = "success"
    } else {
      return this.color = "primary"
    }
  }
}
