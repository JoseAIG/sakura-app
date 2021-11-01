import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UserModalPage } from '../user-modal/user-modal.page';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

  email: string;
  username: string;
  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData()
  }

  //Obtain user data from the BE API
  getData() {
    this.userService.getUserData()
      .subscribe(
        async (res) => {
          this.username = res.username;
          this.email = res.email;
        },
        async (res) => {
          console.log(res.error)
        }
      )
  }

  async confirmLogout(){
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

  private async logout() {
    let loading = await this.loadingController.create();
    await loading.present();
    this.authService.clearToken();
    loading.dismiss();
    this.router.navigateByUrl('/login', { replaceUrl: true })
  }

  async openSettings() {
    const modal = this.modalController.create({
      component: UserModalPage,
      componentProps: {
        'username': this.username,
        'email': this.email
      }
    });

    await (await modal).present();
  }

}
