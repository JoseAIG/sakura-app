import { Component, Input, OnInit } from '@angular/core';
import { Manga } from 'src/app/interfaces/manga';
import { MangaModalPage } from 'src/app/pages/manga-modal/manga-modal.page';
import { MangaPreviewPage } from 'src/app/pages/manga-preview/manga-preview.page';
import { ProfilePage } from 'src/app/pages/profile/profile.page';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss'],
})
export class MangaCardComponent implements OnInit {

  @Input() manga: Manga
  @Input() editable: boolean

  constructor(
    private controllerService: ControllerService,
    private profilePage: ProfilePage
  ) { }

  ngOnInit() { }

  async openManga() {
    const modal = await this.controllerService.createModal({
      component: MangaPreviewPage,
      componentProps: {
        manga: this.manga
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.profilePage.getUserMangas()
    }
  }

  async editManga(event: Event) {
    event.stopPropagation()
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
      this.profilePage.getUserMangas()
    }
  }

}
