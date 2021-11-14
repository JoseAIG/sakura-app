import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private BASE_URL = 'https://sakura-mv.herokuapp.com'

  constructor(private http: HttpClient) { }

  getChapterComments(chapterID: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/chapter/${chapterID}/comments`)
  }

  createComment(chapterID: number, content: string) {
    return this.http.post(`${this.BASE_URL}/chapter/${chapterID}/comments`, { content: content }, this.userHeader())
  }

  editComment(commentID: number, content: string) {
    return this.http.put(`${this.BASE_URL}/comment/${commentID}`, { content: content }, this.userHeader())
  }

  deleteComment(commentID: number) {
    return this.http.delete(`${this.BASE_URL}/comment/${commentID}`, this.userHeader())
  }

  createReply(commentID: number, content: string){
    return this.http.post(`${this.BASE_URL}/comment/${commentID}/replies`, { content: content }, this.userHeader())
  }

  editReply(replyID: number, content: string){
    return this.http.put(`${this.BASE_URL}/reply/${replyID}`, {content: content}, this.userHeader())
  }

  deleteReply(replyID: number){
    return this.http.delete(`${this.BASE_URL}/reply/${replyID}`, this.userHeader())
  }

  userHeader() {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    }
    return header;
  }
}
