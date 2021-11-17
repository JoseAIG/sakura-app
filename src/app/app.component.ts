import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(!this.authService.getUserPermissions().guest){
        this.notificationService.initPush()
      }
    })
  }
}
