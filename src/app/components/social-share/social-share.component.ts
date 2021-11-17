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
      text: "I'm currently reading "+this.manga.title+", Chapter "+this.chapter+". You should take a look in Sakura Manga app so you don't miss it!",
      url: `https://sakura-mv.herokuapp.com/share/${this.manga.manga_id}/chapter/${this.chapter}`,
      dialogTitle: 'Share your progress',
    });
  }

}
