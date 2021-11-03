import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { MangaService } from 'src/app/services/manga.service';

@Component({
  selector: 'app-manga-modal',
  templateUrl: './manga-modal.page.html',
  styleUrls: ['./manga-modal.page.scss'],
})
export class MangaModalPage implements OnInit {

  @Input() edit: boolean;

  mangaForm: FormGroup
  mangaCover: string = null

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private mangaService: MangaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.mangaForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      author: [null, [Validators.required]],
      status: [null, [Validators.required]],
      year: [null, [Validators.required]],
      chapters: [null, [Validators.required]],
      cover: !this.edit ? [null, [Validators.required]] : [null]
    })
  }

  //closing the manga creation modal
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    })
  }

  setCoverPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.mangaCover = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0])
    } else {
      this.mangaCover = null
    }

    //PATCH FILE INTO COVER FORM FIELD
    this.mangaForm.patchValue({
      cover: event.target.files[0]
    });
    this.mangaForm.get('cover').updateValueAndValidity()
  }

  async createManga() {
    console.log('create manga')

    let loading = await this.loadingController.create();
    await loading.present();

    let formData: FormData = new FormData();
    formData.append("title", this.mangaForm.get("title").value);
    formData.append("description", this.mangaForm.get("description").value);
    formData.append("author", this.mangaForm.get("author").value);
    formData.append("status", this.mangaForm.get("status").value);
    formData.append("year", this.mangaForm.get("year").value);
    formData.append("chapters", this.mangaForm.get("chapters").value);
    formData.append("cover", this.mangaForm.get("cover").value);

    this.mangaService.createManga(formData)
      .subscribe(
        async (res) => {
          console.log(res)
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Success',
            message: res.message,
            buttons: ['OK'],
          });
          alert.present()
          this.router.navigateByUrl('/tabs/profile', { replaceUrl: true })
          this.dismiss()
        },
        async (res) => {
          console.log(res)
          await loading.dismiss()
          const alert = await this.alertController.create({
            header: 'Manga creation failed',
            message: res.error.message,
            buttons: ['OK'],
          });
          alert.present()
        }
      )
  }

  uploadManga() {
    console.log('upload manga')
  }
}
