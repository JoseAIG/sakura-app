import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(private router: Router) { }

  openViewer() {
    console.log("open viewer")
    this.router.navigate(['viewer'], { queryParams: { title: "title in query parameters", mangaID: 5, chapterNumber: 1 }})
  }

}
