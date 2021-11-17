import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPermissions } from '../interfaces/user-permissions';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  private BASE_URL = 'https://sakura-mv.herokuapp.com'

  getFollowedMangas() {
    return this.http.get(`${this.BASE_URL}/followed`, this.userHeader())
  }

  followManga(mangaID: number) {
    return this.http.post(`${this.BASE_URL}/follow/${mangaID}`, null, this.userHeader())
  }

  unfollowManga(mangaID: number) {
    return this.http.post(`${this.BASE_URL}/unfollow/${mangaID}`, null, this.userHeader())
  }

  getGuestFollowedMangas() {
    const mangaIDs = localStorage.getItem('GUEST_FOLLOWED_MANGAS')
    return this.http.get(`${this.BASE_URL}/manga/list/${mangaIDs}`)
  }

  followMangaAsGuest(mangaID: number) {
    let guestFollowedMangas = JSON.parse(localStorage.getItem('GUEST_FOLLOWED_MANGAS'))

    if (!guestFollowedMangas) {
      localStorage.setItem('GUEST_FOLLOWED_MANGAS', JSON.stringify([mangaID]))
      return "Now following this manga"
    } else {
      if (guestFollowedMangas.includes(mangaID)) {
        return "You already follow this manga"
      } else {
        guestFollowedMangas.push(mangaID)
        localStorage.setItem('GUEST_FOLLOWED_MANGAS', JSON.stringify(guestFollowedMangas))
        return "Now following this manga"
      }
    }
  }

  unfollowMangaAsGuest(mangaID: number) {
    let guestFollowedMangas = JSON.parse(localStorage.getItem('GUEST_FOLLOWED_MANGAS'))

    if (!guestFollowedMangas) {
      return "You are not following any manga"
    } else {
      if (guestFollowedMangas.includes(mangaID)) {
        guestFollowedMangas.splice(guestFollowedMangas.indexOf(mangaID), 1)
        localStorage.setItem('GUEST_FOLLOWED_MANGAS', JSON.stringify(guestFollowedMangas))
        return "Manga unfollowed"
      } else {
        return "You are not following this manga"
      }
    }
  }

  userHeader() {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    }
    return header;
  }
}
