import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = ''

  constructor(private http:HttpClient) { }

  //data getting methods
  getUserData():Observable<any>{
    return this.http.get(`${this.BASE_URL}`)
  }

  updateUserData(formData:FormData):Observable<any>{
    return this.http.put(`${this.BASE_URL}`,formData)
  }

  deleteUser(formData:FormData):Observable<any>{
    return this.http.post(`${this.BASE_URL}`, formData)
  }
}
