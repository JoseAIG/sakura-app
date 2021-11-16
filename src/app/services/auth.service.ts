import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';

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
  
  logout(){
    if (Capacitor.getPlatform() !== 'web'){
      return this.http.post('https://sakura-mv.herokuapp.com/logout', null, this.userHeader())
    }
  }

  userHeader(){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('TOKEN')}`)
    }
    return header;
  }

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
    try {
      const tokenPayload: any = JSON.parse(atob(localStorage.getItem('TOKEN').split('.')[1]))
      return {id: tokenPayload.id, admin: tokenPayload.admin, guest: false}
    } catch (error) {
      return {id: null, admin: false, guest: true}
    }
  }
}
