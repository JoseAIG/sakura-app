import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Manga } from 'src/app/interfaces/manga';
import { User } from 'src/app/interfaces/user';
import { UserPermissions } from 'src/app/interfaces/user-permissions';
import { AuthService } from 'src/app/services/auth.service';
import { ControllerService } from 'src/app/services/controller.service';
import { MangaService } from 'src/app/services/manga.service';
import { UserService } from 'src/app/services/user.service';
import { ChapterFormModalPage } from '../chapter-form-modal/chapter-form-modal.page';
import { MangaModalPage } from '../manga-modal/manga-modal.page';
import { UserModalPage } from '../user-modal/user-modal.page';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

  userPermissions: UserPermissions;
  user: User;
  userMangas: Manga[]

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mangaService: MangaService,
    private controllerService: ControllerService,
    private router: Router
  ) {
    this.userPermissions = this.authService.getUserPermissions()
  }

  ngOnInit() { }

  ionViewWillEnter() {
    if (!this.userPermissions.guest && this.userPermissions.id) {
      this.getUserData()
      this.getUserMangas()
    }
  }

  //Obtain user data from the BE API
  getUserData() {
    this.userService.getUserData()
      .subscribe(
        async (res: User) => {
          this.user = res
        },
        async (res) => {
          console.log(res.error)
        }
      )
  }

  getUserMangas() {
    this.mangaService.getUserMangas()
      .subscribe(
        async (res) => {
          if (this.userMangas != res.user_mangas) {
            this.userMangas = res.user_mangas
          }
        },
        async (res) => {
          console.log(res.error)
        }
      )
  }

  //logout confirmation prompt
  async confirmLogout() {
    const alert = await this.controllerService.createAlert({
      header: 'Do you want to log out?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.logout()
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel'
        }
      ],
    });

    await alert.present();
  }

  //logout function
  private async logout() {
    let loading = await this.controllerService.createLoading();
    await loading.present();
    this.authService.logout()?.subscribe()
    this.authService.clearToken()
    localStorage.removeItem('VIEWER_STATE')
    loading.dismiss();
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true })
  }

  //function to manage user account
  async openSettings() {
    const modal = await this.controllerService.createModal({
      component: UserModalPage,
      componentProps: {
        'userData': this.user,
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getUserData();
    }
  }

  //function for creating mangas
  async newManga() {
    const modal = await this.controllerService.createModal({
      component: MangaModalPage,
      componentProps: {
        edit: false
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getUserMangas();
    }
  }

  //function for creating chapters
  async newChapter() {
    const modal = await this.controllerService.createModal({
      component: ChapterFormModalPage,
      componentProps: {
        'mangas': this.userMangas,
        edit: false
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data.dismissed) {
      this.getUserMangas();
    }
  }

  doRefresh(event: any) {
    this.getUserData();
    this.getUserMangas();
    event.target.complete();
  }

  //MANGA VIEWER READ MODE SETTINGS
  async readModeSettings() {
    //console.log(localStorage.getItem('READ_MODE'))
    let currentReadMode = localStorage.getItem('READ_MODE')
    const readModeSettingsAlert = this.controllerService.createAlert({
      header: "Set the reading direction",
      inputs: [
        {
          type: 'radio',
          value: 'topToBottom',
          label: 'From Top to Bottom',
          checked: currentReadMode == 'topToBottom' ? true : false
        },
        {
          type: 'radio',
          value: 'bottomToTop',
          label: 'From Bottom to Top',
          checked: currentReadMode == 'bottomToTop' ? true : false
        },
        {
          type: 'radio',
          value: 'leftToRight',
          label: 'Left to Right',
          checked: currentReadMode == 'leftToRight' ? true : false
        },
        {
          type: 'radio',
          value: 'rightToLeft',
          label: 'Right to Left',
          checked: currentReadMode == 'rightToLeft' ? true : false
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {
            localStorage.setItem('READ_MODE', data)
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel'
        }
      ]
    });

    await (await readModeSettingsAlert).present()
  }

}
