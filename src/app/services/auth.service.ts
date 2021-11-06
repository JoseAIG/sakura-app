import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token: string

  constructor(private http: HttpClient) {
    this.checkToken()
  }

  private checkToken() {
    this.token = localStorage.getItem('TOKEN')
    if (this.token && !this.tokenExpired(this.token)) {
      this.isAuthenticated.next(true)
    } else {
      this.isAuthenticated.next(false)
    }
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  login(formData: FormData): Observable<any> {
    return this.http.post<any>('https://sakura-mv.herokuapp.com/login', formData)
  }

  register(formData: FormData): Observable<any>{
    return this.http.post<any>('https://sakura-mv.herokuapp.com/register', formData)
  }
  //https://sakura-mv.herokuapp.com/register

  storeToken(token: string){
    localStorage.setItem('TOKEN', token)
    this.token = token
    this.isAuthenticated.next(true)
  }

  clearToken(){
    localStorage.removeItem('TOKEN')
    this.token = null
    this.isAuthenticated.next(false)
  }

  getUserPermissions(){
    const tokenPayload: any = JSON.parse(atob(localStorage.getItem('TOKEN').split('.')[1]))
    return {id: tokenPayload.id, role: tokenPayload.role}
  }
}
