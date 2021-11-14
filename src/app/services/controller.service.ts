import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  createAlert(options: AlertOptions) {
    return this.alertController.create(options)
  }

  createToast(options: ToastOptions) {
    return this.toastController.create(options)
  }

  createModal(options: ModalOptions) {
    return this.modalController.create(options)
  }

  dismissModal(data: object) {
    return this.modalController.dismiss(data)
  }

  createLoading() {
    return this.loadingController.create()
  }
}
