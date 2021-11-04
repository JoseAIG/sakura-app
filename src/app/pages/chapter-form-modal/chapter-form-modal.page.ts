import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chapter-form-modal',
  templateUrl: './chapter-form-modal.page.html',
  styleUrls: ['./chapter-form-modal.page.scss'],
})
export class ChapterFormModalPage implements OnInit {

  @Input() manga:string;
  @Input() number:string;
  @Input() images:string;

  chapterForm: FormGroup
  chapterImages: string [] = null

  constructor(
    private modalController:ModalController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.chapterForm = this.formBuilder.group({
      manga:[],
      number:[],
      images:[]
    })
  }

  //closing the chapter creation modal
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    })
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
  }
}
