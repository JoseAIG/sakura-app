import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Manga } from 'src/app/interfaces/manga';
import { MangaService } from 'src/app/services/manga.service';
import { ViewerService } from 'src/app/services/viewer.service';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  viewerState: any
  lastMangaRead: Manga

  constructor(
    private router: Router,
    private viewerService: ViewerService,
    private mangaService: MangaService
  ) { }

  async ngOnInit() {
    await StatusBar.setBackgroundColor({ color: '#C22E48'})
    await StatusBar.setStyle({ style: Style.Dark });
  }

  ionViewWillEnter() {
    this.getLastMangaRead()
  }

  private getLastMangaRead() {
    this.viewerState = this.viewerService.getViewerState()

    if (this.viewerState) {
      this.mangaService.getManga(this.viewerState.mangaID)
        .subscribe(
          async (res: any) => {
            this.lastMangaRead = res
          }
        )
    }
  }

  openLastMangaRead() {
    this.router.navigate(['viewer'], { queryParams: { title: this.lastMangaRead.title, mangaID: this.lastMangaRead.manga_id, chapterNumber: this.viewerState.chapterNumber, backURL: this.router.url }, replaceUrl: true })
  }

  doRefresh(event: any) {
    this.getLastMangaRead()
    event.target.complete();
  }
}
