import { Component, Input, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { Manga } from 'src/app/interfaces/manga';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent implements OnInit {

  @Input() manga: Manga
  @Input() chapter: number

  constructor() { }

  ngOnInit() {
    this.sharing()
  }

  async sharing(){
    await Share.share({
      title: this.manga.title,
      text: "Description "+this.manga.description+" .Progress: "+this.chapter,
      // url: this.manga.cover_image,
      dialogTitle: 'Share your progress',
    });
  }
}
