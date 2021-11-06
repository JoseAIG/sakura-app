import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Manga } from 'src/app/interfaces/manga';
import { MangaModalPage } from 'src/app/pages/manga-modal/manga-modal.page';
import { MangaPreviewPage } from 'src/app/pages/manga-preview/manga-preview.page';

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss'],
})
export class MangaCardComponent implements OnInit {

  @Input() manga: Manga
  @Input() editable: boolean

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async openManga() {
    console.log("open manga", this.manga.manga_id)
    const modal = this.modalController.create({
      component: MangaPreviewPage,
      componentProps: {
        manga: this.manga
      }
    });

    await (await modal).present();
  }

  async editManga(event: Event) {
    event.stopPropagation()
    console.log("edit manga", this.manga.manga_id)
    const modal = this.modalController.create({
      component: MangaModalPage,
      componentProps: {
        edit: true,
        manga: this.manga
      }
    });

    await (await modal).present();
  }

}
