import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl:string = environment.url;

  constructor(private http: HttpClient) { }

  validateLogin(user:string|null,pass:string|null){
    return this.http.get(`${this.baseUrl}/user?user=${ user }&pass=${ pass }`)
  }

}
