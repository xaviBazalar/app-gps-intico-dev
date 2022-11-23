import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable, throwError } from 'rxjs';

const URL = environment.urlFlespi;

@Injectable({
  providedIn: 'root'
})
export class MaquinariaService {

  constructor(private http: HttpClient) { }

  obtenerUbicacion( id: string ){
    console.log( id );
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'FlespiToken zEHADORsmfsBrgl17DfP7fqLr83LFY35sAtVeabofuQvyZmtsp8ptmYIlSkQEdJU'
      })
    }
    /* 4656765 */
    const url = `${ URL }/${ id }`;//?fields=telemetry

    const data =  this.http.get(url, options).subscribe((data:any) => {
      console.log('result', data.result)
      return data.result; 
    });

    console.log('data', data);
  }
}
