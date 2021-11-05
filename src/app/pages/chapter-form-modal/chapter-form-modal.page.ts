import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ChapterService } from 'src/app/services/chapter.service';

@Component({
  selector: 'app-chapter-form-modal',
  templateUrl: './chapter-form-modal.page.html',
  styleUrls: ['./chapter-form-modal.page.scss'],
})
export class ChapterFormModalPage implements OnInit {

  @Input() mangas:Object;
  @Input() number:string;
  @Input() images:string;


  chapterForm: FormGroup
  chapterImages: string [] = null
  chapterImagesNames: string [] = null

  constructor(
    private modalController:ModalController,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private chapterService:ChapterService
  ) { }

  ngOnInit() {
    // console.log('mi manga'+this.mangas[0].manga_id)
    this.chapterForm = this.formBuilder.group({
      manga:[null, [Validators.required]],
      number:[null, [Validators.required]],
      images:[null, [Validators.required]]
    })
  }

  get manga() {
    return this.chapterForm.get('manga')
  }

  get chapter() {
    return this.chapterForm.get('number')
  }

  //closing the chapter creation modal
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  //create a new chapter
  async createChapter(){
    let mangaID = this.chapterForm.get("manga").value
    let loading = await this.loadingController.create();
    await loading.present();

    let formData:FormData = new FormData();
    formData.append("number", this.chapterForm.get('number').value);
    formData.append("images", this.chapterForm.get('images').value)

    this.chapterService.createChapter(formData,mangaID)
    .subscribe(
      async (res) => {
        console.log(res)
          await loading.dismiss();
          location.reload()
          this.dismiss()
      },
      async (res) => {
        console.log(res)
        await loading.dismiss()
        const alert = await this.alertController.create({
          header: 'Chapter creation failed',
          message: res.error.message,
          buttons: ['OK'],
        });
        alert.present()
      }
    )
  }


  //chapter preview
  chapterPreview(event:any){
    this.chapterImages = []
    this.chapterImagesNames = []
    let files = event.target.files;
    if(files){
        for(let file of files){
          this.chapterImagesNames.push(file)
          console.log(this.chapterImagesNames)
          let reader = new FileReader();
          reader.onload = (e:any) => {
            this.chapterImages.push(e.target.result)
          }
          reader.readAsDataURL(file)
        }
    }
    this.chapterForm.patchValue({
      images:event.target.files
    });
    this.chapterForm.get('images').updateValueAndValidity()
  }

  // private readFile(file: any) {
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //       const imgBlob = new Blob([reader.result], {type: file.type});
  //       formData.append('images[]', imgBlob, file.name);
  //   };
  //   reader.readAsArrayBuffer(file);
  // }
}
