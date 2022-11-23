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

  }