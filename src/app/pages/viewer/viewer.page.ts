import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { Location } from '@angular/common';
import { AlertController, IonContent } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
})
export class ViewerPage implements OnInit {

  mangaID: number
  chapterNumber: number
  title: string
  images: string[]

  //https://mangastack.cf/manga/a96676e5-8ae2-425e-b549-7f15dd34a6d8/chapter/46b6501a-4c9e-4d91-974b-9274fe684c94
  // images: string[] = [
  //   'https://uploads.mangadex.org/data/46933c48657c37e93b2e20ee7134085e/x1-6b3a1813f068bc2e7907b2747c385b9d1e5b97e1fb08d02f1e92aeff67ea582f.png',
  //   'https://uploads.mangadex.org/data/46933c48657c37e93b2e20ee7134085e/x2-de4d2b348725247c3ca652a8726bc782ece37a49b94f5fdf08cdeeae6c791b20.png',
  //   'https://uploads.mangadex.org/data/46933c48657c37e93b2e20ee7134085e/x3-f17dd2f1d98448df8ec48c85f60b2bf2ab0c014f9008f39fb050199c1fc6289c.png',
  //   'https://uploads.mangadex.org/data/46933c48657c37e93b2e20ee7134085e/x3-f17dd2f1d98448df8ec48c85f60b2bf2ab0c014f9008f39fb050199c1fc6289c.png',
  //   'https://uploads.mangadex.org/data/46933c48657c37e93b2e20ee7134085e/x4-878bad4cb82788231377eb591ff93793295153626339f6c9900e9658ff02c585.png'
  // ]

  private readMode: string = localStorage.getItem("READ_MODE")
  showToolbar = true;
  private previousScroll: number

  @ViewChild(IonContent) content: IonContent;

  constructor(
    private location: Location,
    private alertController: AlertController,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    // GET QUERY PARAMETERS
    this.route.queryParamMap
      .subscribe((e: any) => {
        this.title = e.params.title
        this.mangaID = e.params.mangaID
        this.chapterNumber = e.params.chapterNumber
      });

    // FETCH CHAPTER DATA
    this.http.get(`https://sakura-mv.herokuapp.com/manga/${this.mangaID}/chapter/${this.chapterNumber}`)
      .subscribe(
        (res: any) => {
          console.log(res)
          this.images = res.chapter_images
          // REVERSE ARRAY IF READ MODE IS FROM BOTTOM TO TOP
          if (this.readMode === "bottomToTop") {
            this.images.reverse()
          }
        },
        async (res) => {
          console.log(res.error)
          this.location.back()
          const alert = await this.alertController.create({
            header: 'Error',
            message: res.error.message,
            buttons: ['OK'],
          });
          await alert.present()
        }
      )
  }

  ionViewDidEnter() {
    // GO TO THE BOTTOM OF THE PAGE IF READ MODE IS FROM BOTTOM TO TOP
    if (this.readMode === "bottomToTop") {
      this.content.scrollToBottom(0);
    }
  }

  // GO TO PREVIOUS PAGE INSTEAD OF A FIXED HREF ON ion-back-button
  backButtonEvent() {
    this.location.back()
  }

  openComments() {
    console.log("Open comments");
  }

  // ON SCROLL EVENT FOR ADJUSTING TOOLBAR OPACITY
  onScroll($event: CustomEvent<ScrollDetail>) {
    if (this.readMode === "topToBottom") {
      if ($event && $event.detail.scrollTop) {
        const scrollTop = $event.detail.scrollTop;
        this.showToolbar = scrollTop <= this.previousScroll;
        this.previousScroll = scrollTop
      }
    }
    else if (this.readMode === "bottomToTop") {
      if (!this.previousScroll) {
        this.previousScroll = 0;
      }
      if ($event && $event.detail.scrollTop) {
        const scrollTop = $event.detail.scrollTop;
        this.showToolbar = scrollTop >= this.previousScroll;
        this.previousScroll = scrollTop
      }
    }
  }

  // MANGA VIEWER READ MODE SETTINGS
  async readModeSettings() {
    //console.log(localStorage.getItem('READ_MODE'))
    let currentReadMode = localStorage.getItem('READ_MODE')
    const readModeSettingsAlert = this.alertController.create({
      header: "Set the reading direction",
      inputs: [
        {
          type: 'radio',
          value: 'topToBottom',
          label: 'From Top to Bottom',
          checked: currentReadMode == 'topToBottom' || !currentReadMode ? true : false
        },
        {
          type: 'radio',
          value: 'bottomToTop',
          label: 'From Bottom to Top',
          checked: currentReadMode == 'bottomToTop' ? true : false
        },
        {
          type: 'radio',
          value: 'leftToRight',
          label: 'Left to Right',
          checked: currentReadMode == 'leftToRight' ? true : false
        },
        {
          type: 'radio',
          value: 'rightToLeft',
          label: 'Right to Left',
          checked: currentReadMode == 'rightToLeft' ? true : false
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: data => {
            localStorage.setItem('READ_MODE', data)
            location.reload();
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel'
        }
      ]
    });

    await (await readModeSettingsAlert).present()
  }

}
