import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Manga } from 'src/app/interfaces/manga';
import { AuthService } from 'src/app/services/auth.service';
import { MangaModalPage } from '../manga-modal/manga-modal.page';

@Component({
  selector: 'app-manga-preview',
  templateUrl: './manga-preview.page.html',
  styleUrls: ['./manga-preview.page.scss'],
})
export class MangaPreviewPage implements OnInit {

  @Input() manga: Manga

  userPermissions: object

  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) {
    this.userPermissions = authService.getUserPermissions()
  }

  ngOnInit() {
    console.log(this.userPermissions)
  }

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

  editChapter() {
    console.log("edit chapter")
  }

  openViewer(mangaID: number, chapterNumber: number) {
    console.log("Open viewer, manga id:", mangaID, "chapter number", chapterNumber)
  }

}
