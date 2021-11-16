import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '@capacitor/push-notifications';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = 'https://sakura-mv.herokuapp.com/user'

  constructor(private http:HttpClient) {
   }
  //data getting methods
  getUserData():Observable<any>{
    return this.http.get(`${this.BASE_URL}`, this.userHeader())
  }

  updateUserData(formData:FormData):Observable<any>{
    return this.http.put(`${this.BASE_URL}`,formData, this.userHeader())
  }

  deleteUser():Observable<any>{
    return this.http.delete(`${this.BASE_URL}`, this.userHeader())
  }

  storeNotificationToken(token: Token) {
    return this.http.post(`${this.BASE_URL}/notifications`, token, this.userHeader())
  }

  userHeader(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    }
    return header;
  }
}
