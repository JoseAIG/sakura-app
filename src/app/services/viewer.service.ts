import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {

  constructor() { }

  orderImages(array: string[]){
    return array.sort((a: any, b: any) => (parseInt(a.split("-")[2].match(/\d/g).join("")) > parseInt(b.split("-")[2].match(/\d/g).join(""))) ? 1 : -1)
  }

  setViewerState(mangaID: number, chapterNumber: number, title: string, readMode: string, location: number) {
    // STORE VIEWER STATE IN LOCALSTORAGE
    const state = {
      mangaID: mangaID,
      chapterNumber: chapterNumber,
      title: title,
      readMode: readMode,
      location: location
    }
    localStorage.setItem('VIEWER_STATE', JSON.stringify(state))
  }

  getViewerState(): object {
    return JSON.parse(localStorage.getItem('VIEWER_STATE'))
  }
}
