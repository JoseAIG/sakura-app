import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canLoad(): Observable<boolean> {

    const hasSeenIntro = localStorage.getItem('INTRO_KEY');

    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
          return false;
        }
        else if (!!!hasSeenIntro) {
          this.router.navigateByUrl('/intro', { replaceUrl: true });
          return false
        }
        else {
          return true;
        }
      })
    );
  }

}
