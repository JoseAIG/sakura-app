import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private controllerService: ControllerService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      user: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    })
  }

  get user() {
    return this.loginForm.get('user')
  }

  get password() {
    return this.loginForm.get('password')
  }

  async login() {
    let loading = await this.controllerService.createLoading();
    await loading.present();

    let formData: FormData = new FormData();
    formData.append("user", this.loginForm.get("user").value)
    formData.append("password", this.loginForm.get("password").value)

    this.authService.login(formData)
      .subscribe(
        async (res) => {
          localStorage.removeItem('VIEWER_STATE')
          this.authService.storeToken(res.token)
          await loading.dismiss()
          this.router.navigateByUrl('/tabs/home', { replaceUrl: true })
        },
        async (res) => {
          await loading.dismiss()
          console.log(res.error);
          const alert = await this.controllerService.createAlert({
            header: 'Login failed',
            message: res.error.message,
            buttons: ['OK'],
          });
          alert.present()
        })
  }

}
