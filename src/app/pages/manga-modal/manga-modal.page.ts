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
  @Input() id: number;
  @Input() title: string;
  @Input() author: string;
  @Input() year: string;
  @Input() status: string;
  @Input() chapters: number;
  @Input() description: string;
  @Input() cover: string;

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
      title: [!this.edit ? null : this.title, [Validators.required]],
      description: [!this.edit ? null : this.description, [Validators.required]],
      author: [!this.edit ? null : this.author, [Validators.required]],
      status: [!this.edit ? null : this.status, [Validators.required]],
      year: [!this.edit ? null : this.year, [Validators.required]],
      chapters: [!this.edit ? null : this.chapters, [Validators.required]],
      cover: !this.edit ? [null, [Validators.required]] : [null]
    })

    if (this.cover) {
      this.mangaCover = this.cover
    }
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

  async updateManga() {
    let loading = await this.loadingController.create();
    await loading.present();

    let formData: FormData = new FormData();
    formData.append("id", this.id.toString())
    formData.append("title", this.mangaForm.get("title").value);
    formData.append("description", this.mangaForm.get("description").value);
    formData.append("author", this.mangaForm.get("author").value);
    formData.append("status", this.mangaForm.get("status").value);
    formData.append("year", this.mangaForm.get("year").value);
    formData.append("chapters", this.mangaForm.get("chapters").value);

    //CHECK IF NEW FILE WAS SELECTED, IF NOT, APPEND EMPTY FILE
    if(this.mangaForm.get("cover").value){
      formData.append("cover", this.mangaForm.get("cover").value);
    }else{
      formData.append("cover", new File([""],""), "");
    }

    this.mangaService.updateManga(formData)
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
}
