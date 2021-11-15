import { Component, OnInit } from '@angular/core';
import { Manga } from 'src/app/interfaces/manga';
import { MangaService } from 'src/app/services/manga.service';

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss']
})
export class ExplorePage implements OnInit {

  allMangas: Manga[]
  searchTerm: string

  constructor(
    private mangaService: MangaService,
  ) { }

  ngOnInit() {
    this.getAllMangas()
  }

  //get all mangas uploaded on the app
  getAllMangas() {
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

  doRefresh(event: any) {
    this.getAllMangas()
    event.target.complete();
  }
}
