import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { UserModalPage } from '../user-modal/user-modal.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  email:string;
  username:string;
  registerForm: FormGroup;

  constructor(
    private userService:UserService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.getData()
  }

  //Obtain user data from the BE API
  getData(){
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

  //Update user data and send it to the BE
  updateData(){

  }

  async openSettings(){
    const modal = this.modalController.create({
      component: UserModalPage,
      componentProps:{
        'username':this.username,
        'email':this.email
      }
    });

    await (await modal).present();
  }

}
