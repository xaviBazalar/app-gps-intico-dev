import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable, throwError } from 'rxjs';

const URL = environment.url;

@Injectable({
    providedIn: 'root'
  })
  export class UsuarioService {

    constructor(private http: HttpClient) { }

    

    login( user: string, pass: string ){

    //   const options = {
    //     headers: new HttpHeaders({
    //       'Content-Type':  'application/json',
    //       Authorization: 'FlespiToken zEHADORsmfsBrgl17DfP7fqLr83LFY35sAtVeabofuQvyZmtsp8ptmYIlSkQEdJU'
    //     })
    //   }

      const url = `${ URL }/user?user=${ user }&pass=${ pass }`;//?fields=telemetry
      console.log(url);
      const usuario = this.http.get(url).subscribe((data:any) => {
        console.log('data', data.usuario);
        return data.usuario;
      });

      console.log('usuario', usuario);

      return usuario;   
    }
  }