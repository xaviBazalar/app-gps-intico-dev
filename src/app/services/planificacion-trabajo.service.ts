import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanificacionTrabajoService {
  baseUrl:string = environment.url;
  constructor(private http: HttpClient) { }

  getPlanificacionTrabajo(){
    return this.http.get(`${this.baseUrl}/planificaciontrabajo`)
  }
}
