import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Chapter } from 'src/app/interfaces/chapter';
import { Manga } from 'src/app/interfaces/manga';
import { AuthService } from 'src/app/services/auth.service';
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

  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.userPermissions = authService.getUserPermissions()
  }

  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss()
  }

  async editManga() {
    const modal = this.modalController.create({
      component: MangaModalPage,
      componentProps: {
        edit: true,
        manga: this.manga
      }
    });
    await (await modal).present();
  }


  async editChapter(chapter: Chapter) {
    const modal = this.modalController.create({
      component: ChapterFormModalPage,
      componentProps: {
        edit: true,
        'mangaToEdit': this.manga,
        'chapter': chapter
      }
    });
    await (await modal).present();
  }

  async createChapter(){
    const modal = this.modalController.create({
      component: ChapterFormModalPage,
      componentProps: {
        edit: false,
        mangas: [this.manga]
      }
    });
    await (await modal).present();
  }

  openViewer(mangaID: number, chapterNumber: number) {
    console.log("Open viewer, manga id:", mangaID, "chapter number", chapterNumber)
  }

}
