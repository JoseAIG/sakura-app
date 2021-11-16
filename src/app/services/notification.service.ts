import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private userService: UserService) { }

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
    });

  }

}
