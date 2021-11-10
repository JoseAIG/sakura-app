import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.page.html',
  styleUrls: ['./user-modal.page.scss'],
})
export class UserModalPage implements OnInit {

  @Input() username: string;
  @Input() email: string;

  userForm: FormGroup;
  passwordForm: FormGroup;
  equalPasswords: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      user: [this.username, [Validators.required]]
    })

    this.passwordForm = this.formBuilder.group({
      password: ["", [Validators.minLength(6)]],
      confirmedPassword: ["", [Validators.minLength(6)]]
    }, { validator: this.checkPasswords })
  }

  //getters
  get newEmail() {
    return this.userForm.get('email')
  }

  get user() {
    return this.userForm.get('user')
  }

  get password() {
    return this.passwordForm.get('password')
  }

  get confirmedPassword() {
    return this.passwordForm.get('confirmedPassword')
  }

  //closing the user settings modal
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  //updating user method
  async updateUser() {
    let loading = await this.loadingController.create();
    await loading.present();

    let formData: FormData = new FormData();
    formData.append("username", this.userForm.get("user").value);
    formData.append("email", this.userForm.get("email").value);
    formData.append("password", this.passwordForm.get("password").value);

    this.userService.updateUserData(formData)
      .subscribe(
        async (res) => {
          this.authService.storeToken(res.token)
          await loading.dismiss()
          const alert = await this.alertController.create({
            header: 'Success',
            message: res.message,
            buttons: ['OK'],
          });
          alert.present(),
            this.router.navigateByUrl('/tabs/profile', { replaceUrl: true }),
            this.dismiss()
        },
        async (res) => {
          await loading.dismiss()
          const alert = await this.alertController.create({
            header: 'User update failed',
            message: res.error.message,
            buttons: ['OK'],
          });
          alert.present()
        })

  }

  async confirmUserDeletion() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'This action can not be undone.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deleteUser()
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

  //deleting user method
  private async deleteUser() {
    this.userService.deleteUser()
      .subscribe(
        async (res) => {
          const alert = await this.alertController.create({
            header: 'User Deleted',
            message: res.message,
            buttons: ['OK'],
          });
          alert.present()
          this.authService.clearToken()
          this.dismiss()
          this.router.navigateByUrl('/login', { replaceUrl: true })
        },
        async (res) => {
          const alert = await this.alertController.create({
            header: 'Could not delete user',
            message: res.message,
            buttons: ['OK'],
          });
          alert.present(),
            this.router.navigateByUrl('/login', { replaceUrl: true })
        }
      )
  }

  //password confirmation custom validator
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmedPassword.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  //method for passing password validator message using
  //property binding
  passwordVerifier() {
    let pass = this.passwordForm.get('password').value
    let confirmPass = this.passwordForm.get('confirmedPassword').value
    if (pass === confirmPass) {
      this.equalPasswords = true;
    } else {
      this.equalPasswords = false;
    }
  }
}
