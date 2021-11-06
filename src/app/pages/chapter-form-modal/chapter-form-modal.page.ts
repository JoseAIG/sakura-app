import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Chapter } from 'src/app/interfaces/chapter';
import { Manga } from 'src/app/interfaces/manga';
import { AuthService } from 'src/app/services/auth.service';
import { ChapterService } from 'src/app/services/chapter.service';

@Component({
  selector: 'app-chapter-form-modal',
  templateUrl: './chapter-form-modal.page.html',
  styleUrls: ['./chapter-form-modal.page.scss'],
})
export class ChapterFormModalPage implements OnInit {

  @Input() mangas:Object;
  @Input() edit:boolean;
  @Input() mangaToEdit:Manga;
  @Input() chapter:Chapter;


  chapterForm: FormGroup
  chapterImages: string [] = null
  userPermissions: object

  constructor(
    private modalController:ModalController,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private chapterService:ChapterService,
    private authService: AuthService
  ) {
    this.userPermissions = authService.getUserPermissions()
   }

  ngOnInit() {

    this.chapterForm = this.formBuilder.group({
      manga:[!this.edit ? null : this.mangaToEdit.title, [Validators.required]],
      number:[!this.edit ? null : this.chapter.number, [Validators.required]],
      images:!this.edit ? [null, [Validators.required]] : [null]
    })
  }

  get manga() {
    return this.chapterForm.get('manga')
  }

  get chapterInput() {
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
    for(let i = 0; i<this.chapterForm.get('images').value.length; i++){
      formData.append("images[]", this.chapterForm.get('images').value[i]);
    }

    this.chapterService.createChapter(formData,mangaID)
    .subscribe(
      async (res) => {
        console.log(res)
        await loading.dismiss();
        location.reload()
        this.dismiss()
        const alert = await this.alertController.create({
          header: 'Success',
          message: res.message,
          buttons: ['OK'],
        });
        alert.present()
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

  //chapter edition
  async editChapter(){
    console.log('edit chapter', this.chapter.id)
    let chapterNumber:number = this.chapter.number
    let mangaID = this.mangaToEdit.manga_id
    console.log(this.mangaToEdit)
    let loading = await this.loadingController.create();
    await loading.present();

    let formData:FormData = new FormData();
    formData.append("number", this.chapterForm.get('number').value);
    if(this.chapterForm.get("images").value) {
      for(let i = 0; i<this.chapterForm.get('images').value.length; i++){
        formData.append("images[]", this.chapterForm.get('images').value[i]);
      }
    } else {
      formData.append("images[]", new File([""], ""), "" )
    }

    this.chapterService.updateChapter(formData,mangaID, chapterNumber)
    .subscribe(
      async (res) => {
        console.log(res)
        await loading.dismiss();
        location.reload()
        this.dismiss()
        const alert = await this.alertController.create({
          header: 'Success',
          message: res.message,
          buttons: ['OK'],
        });
        alert.present()
      },
      async (res) => {
        console.log(res)
        await loading.dismiss()
        const alert = await this.alertController.create({
          header: 'Chapter update failed',
          message: res.error.message,
          buttons: ['OK'],
        });
        alert.present()
      }
    )

  }

  //chapter deletion
  async deleteChapter(chapterNumber:number){
    console.log('delete', chapterNumber)
    console.log('manga', this.mangaToEdit.manga_id)
    let loading = await this.loadingController.create();
    await loading.present();

    this.chapterService.deleteChapter(chapterNumber, this.mangaToEdit.manga_id)
      .subscribe(
        async (res) => {
          console.log(res)
          await loading.dismiss()
          location.reload()
          this.dismiss()
        },
        async (res) => {
          console.log(res)
          await loading.dismiss()
          const alert = await this.alertController.create({
            header: 'Could not delete chapter',
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
    let files = event.target.files;
    if(files){
        for(let file of files){
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

}
