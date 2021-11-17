import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Manga } from 'src/app/interfaces/manga';
import { MangaPreviewPage } from 'src/app/pages/manga-preview/manga-preview.page';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-manga-carousel',
  templateUrl: './manga-carousel.component.html',
  styleUrls: ['./manga-carousel.component.scss'],
})
export class MangaCarouselComponent implements OnInit {

  @Input() mangas: Manga[]
  @Output() refresh = new EventEmitter<boolean>();

  constructor(private controllerService: ControllerService) { }

  ngOnInit() { }

  async openManga(manga: Manga) {
    const modal = await this.controllerService.createModal({
      component: MangaPreviewPage,
      componentProps: {
        manga: manga
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.refresh.emit(true)
    }
  }

  sliderOptions = {
    initialSlide: 0,
    slidesPerView: 2,
    autoplay: true,
  }

}
