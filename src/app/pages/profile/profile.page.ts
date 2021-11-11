import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, AlertInput, IonRadio, LoadingController, ModalController } from '@ionic/angular';
import { Manga } from 'src/app/interfaces/manga';
import { AuthService } from 'src/app/services/auth.service';
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

  userPermissions: any;

  email: string;
  username: string;
  dateCreated: string;
  userMangas: Manga[]

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private mangaService: MangaService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.userPermissions = authService.getUserPermissions()
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
        async (res) => {
          this.username = res.username;
          this.email = res.email;
          this.dateCreated = res.date_created;
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
    const alert = await this.alertController.create({
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
    let loading = await this.loadingController.create();
    await loading.present();
    this.authService.clearToken();
    localStorage.removeItem('VIEWER_STATE')
    loading.dismiss();
    this.router.navigateByUrl('/tabs/home', { replaceUrl: true })
  }

  //function to manage user account
  async openSettings() {
    const modal = await this.modalController.create({
      component: UserModalPage,
      componentProps: {
        'username': this.username,
        'email': this.email
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
    const modal = await this.modalController.create({
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
    const modal = await this.modalController.create({
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
    const readModeSettingsAlert = this.alertController.create({
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
