import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Manga } from '../interfaces/manga';
import { MangaPreviewPage } from '../pages/manga-preview/manga-preview.page';
import { ControllerService } from './controller.service';
import { MangaService } from './manga.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private userService: UserService,
    private controllerService: ControllerService,
    private mangaService: MangaService
  ) { }

  public initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush()
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive) {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log("Token:", JSON.stringify(token))
      this.userService.storeNotificationToken(token)
        .subscribe(
          res => {
            console.log(res)
          },
          res => {
            console.log(res)
          }
        )
    })

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error:', JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      console.log('Push received:', JSON.stringify(notification));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
      console.log('Action performed:', JSON.stringify(notification.notification));
      const mangaID: number = notification.notification.data.mangaID
      //SHOW LOADING 
      let loading = await this.controllerService.createLoading();
      loading.present();
      //FETCH MANGA
      this.mangaService.getManga(mangaID)
        .subscribe(
          async (res: Manga) => {
            loading.dismiss();
            const modal = await this.controllerService.createModal({
              component: MangaPreviewPage,
              componentProps: {
                manga: res
              }
            });
            await modal.present();
          },
          async (res: any) => {
            loading.dismiss();
          }
        )
    });

  }

}
