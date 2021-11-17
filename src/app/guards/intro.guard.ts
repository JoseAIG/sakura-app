import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { ViewerState } from '../interfaces/viewer-state';
import { ViewerService } from '../services/viewer.service';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(
    private router: Router,
    private viewerService: ViewerService
  ) { }

  async canLoad(): Promise<boolean> {

    const hasSeenIntro = localStorage.getItem('INTRO_KEY');
    const viewerState: ViewerState = this.viewerService.getViewerState()

    if (!!hasSeenIntro && !viewerState?.open) {
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      return false;
    }
    else if (viewerState?.open) {
      this.router.navigate(['viewer'], { queryParams: { title: viewerState.title, mangaID: viewerState.mangaID, chapterNumber: viewerState.chapterNumber, backURL: this.router.url }, replaceUrl: true })
    }
    else {
      return true;
    }
  }

}
