import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Manga } from 'src/app/interfaces/manga';
import { ControllerService } from 'src/app/services/controller.service';
import { MangaService } from 'src/app/services/manga.service';

@Component({
  selector: 'app-manga-modal',
  templateUrl: './manga-modal.page.html',
  styleUrls: ['./manga-modal.page.scss'],
})
export class MangaModalPage implements OnInit {

  @Input() manga: Manga
  @Input() edit: boolean;

  mangaForm: FormGroup
  mangaCover: string = null

  constructor(
    private formBuilder: FormBuilder,
    private controllerService: ControllerService,
    private mangaService: MangaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.mangaForm = this.formBuilder.group({
      title: [!this.edit ? null : this.manga.title, [Validators.required]],
      description: [!this.edit ? null : this.manga.description, [Validators.required]],
      author: [!this.edit ? null : this.manga.author, [Validators.required]],
      status: [!this.edit ? null : this.manga.status, [Validators.required]],
      year: [!this.edit ? null : this.manga.year, [Validators.required]],
      cover: !this.edit ? [null, [Validators.required]] : [null]
    })

    if (this.manga && this.manga.cover_image) {
      this.mangaCover = this.manga.cover_image
    }
  }

  //closing the manga creation modal
  dismiss() {
    this.controllerService.dismissModal({
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
    let loading = await this.controllerService.createLoading();
    await loading.present();

    let formData: FormData = new FormData();
    formData.append("title", this.mangaForm.get("title").value);
    formData.append("description", this.mangaForm.get("description").value);
    formData.append("author", this.mangaForm.get("author").value);
    formData.append("status", this.mangaForm.get("status").value);
    formData.append("year", this.mangaForm.get("year").value);
    formData.append("cover", this.mangaForm.get("cover").value);

    this.mangaService.createManga(formData)
      .subscribe(
        async (res) => {
          console.log(res)
          await loading.dismiss();
          this.dismiss()
        },
        async (res) => {
          console.log(res)
          await loading.dismiss()
          const alert = await this.controllerService.createAlert({
            header: 'Manga creation failed',
            message: res.error.message,
            buttons: ['OK'],
          });
          alert.present()
        }
      )
  }

  async updateManga() {
    let loading = await this.controllerService.createLoading();
    await loading.present();

    let formData: FormData = new FormData();
    formData.append("id", this.manga.manga_id.toString())
    formData.append("title", this.mangaForm.get("title").value);
    formData.append("description", this.mangaForm.get("description").value);
    formData.append("author", this.mangaForm.get("author").value);
    formData.append("status", this.mangaForm.get("status").value);
    formData.append("year", this.mangaForm.get("year").value);

    //CHECK IF NEW FILE WAS SELECTED, IF NOT, APPEND EMPTY FILE
    if (this.mangaForm.get("cover").value) {
      formData.append("cover", this.mangaForm.get("cover").value);
    } else {
      formData.append("cover", new File([""], ""), "");
    }

    this.mangaService.updateManga(formData)
      .subscribe(
        async (res) => {
          console.log(res)
          await loading.dismiss();
          this.dismiss()
        },
        async (res) => {
          console.log(res)
          await loading.dismiss()
          const alert = await this.controllerService.createAlert({
            header: 'Manga update failed',
            message: res.error.message,
            buttons: ['OK'],
          });
          alert.present()
        }
      )
  }

  async confirmDeletion() {
    const alert = await this.controllerService.createAlert({
      header: 'Delete this manga?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.deleteManga()
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel'
        }
      ],
    });

    await alert.present();
  }

  async deleteManga() {
    let loading = await this.controllerService.createLoading();
    await loading.present();

    this.mangaService.deleteManga(this.manga.manga_id)
      .subscribe(
        async (res) => {
          console.log(res)
          await loading.dismiss()
          this.dismiss()
        },
        async (res) => {
          console.log(res)
          await loading.dismiss()
          const alert = await this.controllerService.createAlert({
            header: 'Could not delete manga',
            message: res.error.message,
            buttons: ['OK'],
          });
          alert.present()
        }
      )
  }


}
