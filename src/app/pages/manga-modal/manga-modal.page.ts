import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-manga-modal',
  templateUrl: './manga-modal.page.html',
  styleUrls: ['./manga-modal.page.scss'],
})
export class MangaModalPage implements OnInit {

  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit() {
  }

  //closing the manga creation modal
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }
}
