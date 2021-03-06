import { Component, OnInit, ViewChild } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { IonContent, IonSlides } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MangaPreviewPage } from '../manga-preview/manga-preview.page';
import { ChapterService } from 'src/app/services/chapter.service';
import { MangaService } from 'src/app/services/manga.service';
import { ViewerService } from 'src/app/services/viewer.service';
import { CommentsPage } from '../comments/comments.page';
import { ControllerService } from 'src/app/services/controller.service';
import { ViewerState } from 'src/app/interfaces/viewer-state';
import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
})
export class ViewerPage implements OnInit {

  chapterID: number
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
    private chapterService: ChapterService,
    private mangaService: MangaService,
    private viewerService: ViewerService,
    private route: ActivatedRoute,
    private controllerService: ControllerService
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
          this.chapterID = res.chapter_id
          try {
            this.images = this.viewerService.orderImages(res.chapter_images)
          } catch (error) {
            this.images = res.chapter_images
          }
          // REVERSE ARRAY IF READ MODE IS FROM BOTTOM TO TOP OR RIGHT TO LEFT
          if (this.readMode === "bottomToTop" || this.readMode === "rightToLeft") {
            this.images.reverse()
          }
        },
        async (res) => {
          console.log(res.error)
          this.router.navigateByUrl(this.backURL, { replaceUrl: true })
          const alert = await this.controllerService.createAlert({
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
    const viewerState: ViewerState = this.viewerService.getViewerState()
    if(viewerState){
      if((this.readMode === viewerState.readMode && (this.readMode === "topToBottom" || this.readMode === "bottomToTop")) && this.mangaID === viewerState.mangaID && this.chapterNumber === viewerState.chapterNumber){
        this.content.scrollToPoint(0, viewerState.location, 1000)
        this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: viewerState.location, open: true})
      }
      else if((this.readMode === viewerState.readMode && (this.readMode === "leftToRight" || this.readMode === "rightToLeft")) && this.mangaID === viewerState.mangaID && this.chapterNumber === viewerState.chapterNumber){
        await this.slides.slideTo(viewerState.location, 1000)
        this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: viewerState.location, open: true})
      }
      else{
        this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: null, open: true})
      }
    }else{
      this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: null, open: true})
    }
  }

  // GO TO PREVIOUS PAGE INSTEAD OF A FIXED HREF ON ion-back-button
  async backButtonEvent() {
    let loading = await this.controllerService.createLoading();
    loading.present();

    const viewerState: ViewerState = this.viewerService.getViewerState()
    this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: viewerState.location, open: false})

    this.mangaService.getManga(this.mangaID)
      .subscribe(
        async (res: any) => {
          loading.dismiss();
          this.router.navigateByUrl(this.backURL, { replaceUrl: true })
          const modal = this.controllerService.createModal({
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

  async openComments() {
    const modal = await this.controllerService.createModal({
      component: CommentsPage,
      componentProps: {
        chapterID: this.chapterID
      }
    });
    await modal.present();
  }

  // ON SCROLL EVENT FOR ADJUSTING TOOLBAR OPACITY
  onScroll($event: CustomEvent<ScrollDetail>) {
    if (this.readMode === "topToBottom") {
      if ($event && $event.detail.scrollTop) {
        const scrollTop = $event.detail.scrollTop;
        this.showToolbar = scrollTop <= this.previousScroll;
        this.previousScroll = scrollTop
        this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: scrollTop, open: true})
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
        this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: scrollTop, open: true})
      }
    }
  }

  slideChanged(){
    this.slides.getActiveIndex().then(
      (index: number)=>{
        this.viewerService.setViewerState({mangaID: this.mangaID, chapterNumber: this.chapterNumber, title: this.title, readMode: this.readMode, location: index, open: true})
     });
  }

  // MANGA VIEWER READ MODE SETTINGS
  async readModeSettings() {
    const currentReadMode = localStorage.getItem('READ_MODE')
    const readModeSettingsAlert = this.controllerService.createAlert({
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

  //shareFunction
  async socialShare(){
    console.log('share')
    let myManga = null;
    this.mangaService.getManga(this.mangaID)
      .subscribe(
        async (res: any) => {
          myManga = res

        console.log(myManga)
        const modal = await this.controllerService.createPopover({
        component:SocialShareComponent,
        componentProps:{
          manga: myManga,
          chapter: this.chapterNumber
        }
      })
      await modal.present()
    }
    )
  }
}
