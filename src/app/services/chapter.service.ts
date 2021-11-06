import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  // http://127.0.0.1:5000/
  // https://sakura-mv.herokuapp.com
  private BASE_URL = 'https://sakura-mv.herokuapp.com'

  constructor(private http:HttpClient) { }

  getChapter(chapterNumber:number, mangaID:number): Observable<any>{
    return this.http.get(`${this.BASE_URL}/manga/${mangaID}/chapter/${chapterNumber}`)
  }

  getMangaChapters(mangaID:number):Observable<any>{
    return this.http.get(`${this.BASE_URL}/manga/${mangaID}/chapters`)
  }

  createChapter(formData:FormData, mangaID:number):Observable<any>{
    return this.http.post<any>(`${this.BASE_URL}/manga/${mangaID}/chapters`, formData, this.userHeader())
  }

  updateChapter(formData:FormData,mangaID:number, chapterNumber:number):Observable<any>{
    return this.http.put<any>(`${this.BASE_URL}/manga/${mangaID}/chapter/${chapterNumber}`, formData, this.userHeader())
  }

  deleteChapter(chapterNumber:number, mangaID:number):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/manga/${mangaID}/chapter/${chapterNumber}`, this.userHeader())
  }

  userHeader() {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    }
    return header;
  }

}



