import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private http: HttpClient) { }

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

  userHeader() {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    }
    return header;
  }
}
