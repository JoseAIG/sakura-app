import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MangaModalPage } from 'src/app/pages/manga-modal/manga-modal.page';

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss'],
})
export class MangaCardComponent implements OnInit {

  @Input() id: number
  @Input() cover: string
  @Input() title: string
  @Input() author: string
  @Input() description: string
  @Input() chapters: number
  @Input() year: number
  @Input() status: string
  @Input() dateCreated: string
  @Input() editable: boolean

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  openManga() {
    console.log("open manga", this.id)
  }

  async editManga(event: Event) {
    event.stopPropagation()
    console.log("edit manga", this.id)
    const modal = this.modalController.create({
      component: MangaModalPage,
      componentProps: {
        edit: true,
        id: this.id,
        cover: this.cover,
        title: this.title,
        author: this.author,
        chapters: this.chapters,
        year: this.year,
        status: this.status,
        description: this.description
      }
    });

    await (await modal).present();
  }

}
