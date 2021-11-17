import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chapter } from 'src/app/interfaces/chapter';
import { Manga } from 'src/app/interfaces/manga';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthService } from 'src/app/services/auth.service';
import { ControllerService } from 'src/app/services/controller.service';
import { FollowService } from 'src/app/services/follow.service';
import { MangaService } from 'src/app/services/manga.service';
import { ChapterFormModalPage } from '../chapter-form-modal/chapter-form-modal.page';
import { MangaModalPage } from '../manga-modal/manga-modal.page';

@Component({
  selector: 'app-manga-preview',
  templateUrl: './manga-preview.page.html',
  styleUrls: ['./manga-preview.page.scss'],
})
export class MangaPreviewPage implements OnInit {

  @Input() manga: Manga
  @Input() chapter: Chapter

  userPermissions: UserPermissions
  followedMangasID: number[]
  color: string

  constructor(
    private controllerService: ControllerService,
    private mangaService: MangaService,
    private followService: FollowService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userPermissions = authService.getUserPermissions()
  }

  ngOnInit() {
    this.getFollowedMangas()
    this.getState()
  }

  getMangaData() {
    this.mangaService.getManga(this.manga.manga_id)
      .subscribe(
        async (res: Manga) => {
          this.manga = res
        }
      )
  }

  getFollowedMangas() {
    if (!this.userPermissions.guest) {
      this.followService.getFollowedMangas()
        .subscribe(
          (res: { status: number, followedMangas: Manga[] }) => {
            this.followedMangasID = res.followedMangas.map(value => value.manga_id)
          }
        )
    } else {
      this.followService.getGuestFollowedMangas()
        .subscribe(
          (res: { status: number, mangaList: Manga[] }) => {
            this.followedMangasID = res.mangaList.map(value => value.manga_id)
          }
        )
    }
  }

  async dismiss() {
    await this.controllerService.dismissModal({
      'dismissed': true
    })
  }

  async editManga() {
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
      this.getMangaData()
    }
  }


  async editChapter(chapter: Chapter) {
    const modal = await this.controllerService.createModal({
      component: ChapterFormModalPage,
      componentProps: {
        edit: true,
        'mangaToEdit': this.manga,
        'chapter': chapter
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getMangaData()
    }
  }

  async createChapter() {
    const modal = await this.controllerService.createModal({
      component: ChapterFormModalPage,
      componentProps: {
        edit: false,
        mangas: [this.manga]
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getMangaData();
    }
  }

  openViewer(manga: Manga, chapterNumber: number) {
    this.router.navigate(['viewer'], { queryParams: { title: manga.title, mangaID: manga.manga_id, chapterNumber: chapterNumber, backURL: this.router.url } })
    this.dismiss()
  }

  async followManga(mangaID: number) {
    if (!this.userPermissions.guest) {
      //IF USER IS NOT A GUEST, REQUEST FOLLOW TO API
      this.followService.followManga(mangaID)
        .subscribe(
          async (res: { status: number, message: string }) => {
            const toast = await this.controllerService.createToast({
              message: res.message,
              duration: 2000
            });
            await toast.present();
            this.getFollowedMangas()
          },
          async (res) => {
            const toast = await this.controllerService.createToast({
              message: res.error.message,
              duration: 2000
            });
            await toast.present();
          }
        )
    } else {
      //IF USER IS A GUEST, FOLLOW MANGA STORING THE VALUE IN LOCALSTORAGE
      const result = this.followService.followMangaAsGuest(mangaID)
      const toast = await this.controllerService.createToast({
        message: result,
        duration: 2000
      });
      await toast.present();
      this.getFollowedMangas()
    }

  }

  async unfollowManga(mangaID: number) {
    if (!this.userPermissions.guest) {
      //IF USER IS NOT A GUEST, REQUEST FOLLOW TO API
      this.followService.unfollowManga(mangaID)
        .subscribe(
          async (res: { status: number, message: string }) => {
            const toast = await this.controllerService.createToast({
              message: res.message,
              duration: 2000
            });
            await toast.present();
            this.getFollowedMangas()
          },
          async (res) => {
            const toast = await this.controllerService.createToast({
              message: res.error.message,
              duration: 2000
            });
            await toast.present();
          }
        )
    } else {
      //IF USER IS A GUEST, FOLLOW MANGA STORING THE VALUE IN LOCALSTORAGE
      const result = this.followService.unfollowMangaAsGuest(mangaID)
      const toast = await this.controllerService.createToast({
        message: result,
        duration: 2000
      });
      await toast.present();
      this.getFollowedMangas()
    }
  }

  //return manga chip color by state
  getState() {
    if (this.manga.status == "Ongoing") {
      return this.color = "success"
    } else {
      return this.color = "primary"
    }
  }
}
