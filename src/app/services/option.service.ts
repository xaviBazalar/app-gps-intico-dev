import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OptionModel } from '../models/option';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OptionService {
  baseUrl:string = environment.url;

  constructor(private http: HttpClient) { }

  postOption(option: OptionModel) {
    return this.http.post(`${ this.baseUrl }/option`, option)
        
  }

  getOption(){
    return this.http.get(`${this.baseUrl}/option`)
  }
}
