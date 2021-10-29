import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router) { }

  async canLoad(): Promise<boolean> {
    
    const hasSeenIntro = localStorage.getItem('INTRO_KEY');

    if (!!hasSeenIntro) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false;
    } else {
      return true;
    }
  }
  
}
