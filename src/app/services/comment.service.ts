import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private BASE_URL = 'https://sakura-mv.herokuapp.com'

  constructor(private http: HttpClient) { }

  getChapterComments(chapterID: number): Observable<any>{
    return this.http.get(`${this.BASE_URL}/chapter/${chapterID}/comments`)
  }
}
