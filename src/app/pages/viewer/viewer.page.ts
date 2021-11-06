import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { Location } from '@angular/common';
import { AlertController, IonContent, IonSlides } from '@ionic/angular';
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

  private readMode: string = localStorage.getItem("READ_MODE")
  showToolbar = true;
  private previousScroll: number

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonSlides) slides: IonSlides;

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
          // REVERSE ARRAY IF READ MODE IS FROM BOTTOM TO TOP OR RIGHT TO LEFT
          if (this.readMode === "bottomToTop" || this.readMode === "rightToLeft") {
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
    else if (this.readMode === "rightToLeft") {
      this.slides.slideTo(this.images.length, 0);
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
    console.log("scroll")
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
