import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  baseUrl:string = environment.url;
  constructor(private http: HttpClient) { }

  getContratos(){
    return this.http.get(`${this.baseUrl}/contract`)
  }
}
