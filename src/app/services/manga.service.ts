import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangaService {

  private BASE_URL = 'https://sakura-mv.herokuapp.com/manga'

  constructor(private http: HttpClient) { }

  getManga(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${id}`)
  }

  getUserMangas(): Observable<any> {
    return this.http.get(`${this.BASE_URL}`, this.userHeader())
  }

  createManga(formData: FormData): Observable<any> {
    return this.http.post<any>(this.BASE_URL, formData, this.userHeader())
  }

  updateManga(formData: FormData): Observable<any> {
    return this.http.put<any>(this.BASE_URL, formData, this.userHeader())
  }

  deleteManga(id: number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/${id}`, this.userHeader())
  }

  userHeader() {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    }
    return header;
  }
}
