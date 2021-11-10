import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { AlertController, IonContent, IonSlides, LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaPreviewPage } from '../manga-preview/manga-preview.page';
import { ChapterService } from 'src/app/services/chapter.service';
import { MangaService } from 'src/app/services/manga.service';
import { ViewerService } from 'src/app/services/viewer.service';

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
  backURL: string

  private readMode: string = localStorage.getItem("READ_MODE")
  showToolbar = true;
  private previousScroll: number

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private chapterService: ChapterService,
    private mangaService: MangaService,
    private viewerService: ViewerService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {

    // GET QUERY PARAMETERS
    this.route.queryParamMap
      .subscribe((e: any) => {
        this.title = e.params.title
        this.mangaID = e.params.mangaID
        this.chapterNumber = e.params.chapterNumber
        this.backURL = e.params.backURL
      });

    // FETCH CHAPTER DATA
    this.chapterService.getChapter(this.chapterNumber, this.mangaID)
      .subscribe(
        (res: any) => {
          this.images = res.chapter_images
          // REVERSE ARRAY IF READ MODE IS FROM BOTTOM TO TOP OR RIGHT TO LEFT
          if (this.readMode === "bottomToTop" || this.readMode === "rightToLeft") {
            this.images.reverse()
          }
        },
        async (res) => {
          console.log(res.error)
          this.router.navigateByUrl(this.backURL, { replaceUrl: true })
          const alert = await this.alertController.create({
            header: 'Error',
            message: res.error.message,
            buttons: ['OK'],
          });
          await alert.present()
        }
      )
  }

  async ionViewDidEnter() {
    // GO TO THE BOTTOM OF THE PAGE IF READ MODE IS FROM BOTTOM TO TOP
    if (this.readMode === "bottomToTop") {
      this.content.scrollToBottom(0);
    }
    else if (this.readMode === "rightToLeft") {
      await this.slides.slideTo(this.images.length, 0);
    }

    // GET VIEWER STATE AND CHECK IF SETTINGS ARE EQUAL FOR RECOVERING THE STATE
    const viewerState: any = this.viewerService.getViewerState()
    if(viewerState){
      if((this.readMode === viewerState.readMode && (this.readMode === "topToBottom" || this.readMode === "bottomToTop")) && this.mangaID === viewerState.mangaID && this.chapterNumber === viewerState.chapterNumber){
        this.content.scrollToPoint(0, viewerState.location, 1000)
      }
      else if((this.readMode === viewerState.readMode && (this.readMode === "leftToRight" || this.readMode === "rightToLeft")) && this.mangaID === viewerState.mangaID && this.chapterNumber === viewerState.chapterNumber){
        await this.slides.slideTo(viewerState.location, 1000)
      }
      else{
        this.viewerService.setViewerState(this.mangaID, this.chapterNumber, this.title, this.readMode, null)
      }
    }else{
      this.viewerService.setViewerState(this.mangaID, this.chapterNumber, this.title, this.readMode, null)
    }
  }

  // GO TO PREVIOUS PAGE INSTEAD OF A FIXED HREF ON ion-back-button
  async backButtonEvent() {
    let loading = await this.loadingController.create();
    loading.present();

    this.mangaService.getManga(this.mangaID)
      .subscribe(
        async (res: any) => {
          loading.dismiss();
          this.router.navigateByUrl(this.backURL, { replaceUrl: true })
          const modal = this.modalController.create({
            component: MangaPreviewPage,
            componentProps: {
              manga: res
            }
          });
          await (await modal).present();
        },
        async (res: any) => {
          loading.dismiss();
        }
      )
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
        this.viewerService.setViewerState(this.mangaID, this.chapterNumber, this.title, this.readMode, scrollTop)
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
        this.viewerService.setViewerState(this.mangaID, this.chapterNumber, this.title, this.readMode, scrollTop)
      }
    }
  }

  slideChanged(){
    this.slides.getActiveIndex().then(
      (index: number)=>{
        this.viewerService.setViewerState(this.mangaID, this.chapterNumber, this.title, this.readMode, index)
     });
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
