import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup
  equalPasswords: boolean

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController) {

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      user: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmedPassword: [null, [Validators.required, Validators.minLength(6)]]
    }, { validator: this.checkPasswords })
  }
  //,{validator:this.checkIfMatchingPasswords('passsword','confirmedPassword')}

  get email() {
    return this.registerForm.get('email')
  }

  get user() {
    return this.registerForm.get('user')
  }

  get password() {
    return this.registerForm.get('password')
  }

  get confirmedPassword() {
    return this.registerForm.get('confirmedPassword')
  }


  async register() {
    let loading = await this.loadingController.create();
    await loading.present();

    let formData: FormData = new FormData();
    formData.append("username", this.registerForm.get("user").value);
    formData.append("email", this.registerForm.get("email").value);
    formData.append("password", this.registerForm.get("password").value);

    this.authService.register(formData)
      .subscribe(
        async (res) => {
          await loading.dismiss()
          const alert = await this.alertController.create({
            header: 'Register failed',
            message: res.message,
            buttons: ['OK'],
          });
          alert.present()
          this.router.navigateByUrl('/login', { replaceUrl: true })
        },
        async (res) => {
          await loading.dismiss()
          console.log(res.error);
          const alert = await this.alertController.create({
            header: 'Register failed',
            message: res.error.message,
            buttons: ['OK'],
          });
          alert.present()
        })
  }

  //password confirmation custom validator
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmedPassword.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  passwordVerifier() {
    let pass = this.registerForm.get('password').value
    let confirmPass = this.registerForm.get('confirmedPassword').value
    if (pass === confirmPass) {
      this.equalPasswords = true;
    } else {
      this.equalPasswords = false;
    }
    console.log(pass, confirmPass, this.equalPasswords)
  }

}



