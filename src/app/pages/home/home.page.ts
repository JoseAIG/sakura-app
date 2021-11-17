import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Manga } from 'src/app/interfaces/manga';
import { MangaService } from 'src/app/services/manga.service';
import { ViewerService } from 'src/app/services/viewer.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { FollowService } from 'src/app/services/follow.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserPermissions } from 'src/app/interfaces/user-permissions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  userPermissions: UserPermissions
  viewerState: any
  lastMangaRead: Manga
  followedMangas: Manga[]

  constructor(
    private router: Router,
    private authService: AuthService,
    private viewerService: ViewerService,
    private mangaService: MangaService,
    private followService: FollowService
  ) {
    this.userPermissions = this.authService.getUserPermissions()
  }

  async ngOnInit() {
    await StatusBar.setBackgroundColor({ color: '#C22E48' })
    await StatusBar.setStyle({ style: Style.Dark });
  }

  ionViewWillEnter() {
    this.userPermissions = this.authService.getUserPermissions()
    this.getLastMangaRead()
    this.getFollowedMangas()
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

  private getFollowedMangas() {
    //CLEAR PREVIOUS DATA
    this.followedMangas = null
    //IF USER IS NOT A GUEST, FETCH FOLLOWED MANGAS
    if (!this.userPermissions.guest) {
      this.followService.getFollowedMangas()
        .subscribe(
          (res: {status: number, followedMangas: Manga[]}) => {
            this.followedMangas = res.followedMangas
          },
          (res) => {
            console.log(res.error)
          }
        )
    }
  }

  openLastMangaRead() {
    this.router.navigate(['viewer'], { queryParams: { title: this.lastMangaRead.title, mangaID: this.lastMangaRead.manga_id, chapterNumber: this.viewerState.chapterNumber, backURL: this.router.url }, replaceUrl: true })
  }

  doRefresh(event: any) {
    this.getLastMangaRead()
    this.getFollowedMangas()
    event?.target.complete();
  }
}
