import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable, throwError } from 'rxjs';
import { formatDate } from "@angular/common";

const URL = environment.urlFlespi;
const baseUrl = environment.url;

@Injectable({
  providedIn: 'root'
})
export class MaquinariaService {

  constructor(private http: HttpClient) { }

  obtenerUbicacion( id: string ){
    // console.log( id );
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'FlespiToken zEHADORsmfsBrgl17DfP7fqLr83LFY35sAtVeabofuQvyZmtsp8ptmYIlSkQEdJU'
      })
    }
    /* 4656765 */
    const url = `${ URL }/${ id }?fields=telemetry%2Cconnected`;//

    return  this.http.get(url, options)
    // .subscribe((data:any) => {
    //   console.log('result', data.result)
    //   return data.result; 
    // });

    // console.log('data', data);
  }

  obtenerHistorial( id: String){
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'FlespiToken zEHADORsmfsBrgl17DfP7fqLr83LFY35sAtVeabofuQvyZmtsp8ptmYIlSkQEdJU'
      })
    }
    /* 4656765 */
    /* 1670216400 */
    const fechaDesde = new Date();
    fechaDesde.setHours(0)
    fechaDesde.setMinutes(0)
    fechaDesde.setSeconds(0)
    fechaDesde.setMilliseconds(0)
    const fechaDesdeTS = (fechaDesde).getTime() / 1000;
       
    const url = `${ URL }/${ id }?messages?data=%7B%22from%22%3A${ fechaDesdeTS }%7D`;//

    return  this.http.get(url, options)    
  }

   obtenerUbicaTiempo( id: String, desde: String, hasta: String){
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'FlespiToken zEHADORsmfsBrgl17DfP7fqLr83LFY35sAtVeabofuQvyZmtsp8ptmYIlSkQEdJU'
      })
    }
           
    const url = `${ URL }/${ id }/messages?data=%7B%22from%22%3A${ desde }%2C%22to%22%3A${ hasta }%7D`;//
    // console.log(url)
    return  this.http.get(url, options)    
  } 

  getMachine(idUsuario: String){
    return this.http.get(`${ baseUrl }/machine?idUser= ${ idUsuario }`)
  }
}
