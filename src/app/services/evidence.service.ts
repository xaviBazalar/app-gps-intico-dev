import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvidenceModel } from '../models/evidence';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  baseUrl:string = environment.url;

  constructor(private http: HttpClient) { }

  guardarEvidence(evidence: EvidenceModel) {
    console.log(evidence);

    return this.http.post(`${ this.baseUrl }/evidence`, evidence)
        
  }

  obtenerEvidence(task: string){
    return this.http.get(`${this.baseUrl}/evidence?task=${ task }`)
  }
}
