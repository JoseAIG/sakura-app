import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Manga } from 'src/app/interfaces/manga';
import { MangaPreviewPage } from 'src/app/pages/manga-preview/manga-preview.page';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-manga-list',
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.scss'],
})
export class MangaListComponent implements OnInit {

  @Input() manga: Manga
  color: string

  @Output()
  refresh = new EventEmitter<boolean>();

  constructor(
    private controllerService: ControllerService
  ) { }

  ngOnInit() {
    this.getState()
  }

  async openManga() {
    console.log("open manga", this.manga.manga_id)
    const modal = await this.controllerService.createModal({
      component: MangaPreviewPage,
      componentProps: {
        manga: this.manga
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.refresh.emit(true)
    }
  }

  //this function gets the state of the manga and passes it by property binding
  //to apply color to the chips
  getState() {
    if (this.manga.status == "Ongoing") {
      return this.color = "success"
    } else {
      return this.color = "primary"
    }
  }

}
