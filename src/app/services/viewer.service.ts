import { Injectable } from '@angular/core';
import { ViewerState } from '../interfaces/viewer-state';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {

  constructor() { }

  orderImages(array: string[]){
    return array.sort((a: any, b: any) => (parseInt(a.split("-")[2].match(/\d/g).join("")) > parseInt(b.split("-")[2].match(/\d/g).join(""))) ? 1 : -1)
  }

  setViewerState(viewerState: ViewerState) {
    localStorage.setItem('VIEWER_STATE', JSON.stringify(viewerState))
  }

  getViewerState(): ViewerState {
    return JSON.parse(localStorage.getItem('VIEWER_STATE'))
  }
}
