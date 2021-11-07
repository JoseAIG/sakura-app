import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Manga } from 'src/app/interfaces/manga';
import { ChapterService } from 'src/app/services/chapter.service';
import { MangaService } from 'src/app/services/manga.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  allMangas: Manga[]

  constructor(
    private mangaService: MangaService,
    private chapterService: ChapterService
  ) {}

  ngOnInit() {
    this.getAllMangas()
  }

  //get all mangas uploaded on the app
  getAllMangas(){
    this.mangaService.getAllMangas()
    .subscribe(
      async (res) => {
        this.allMangas = res.all_mangas
      },
      async (res) => {
        console.log(res.error)
      }

    )
  }

}
