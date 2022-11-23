import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient, private fileTransfer: FileTransfer) { }

  // subirImagen(img: string){

  //   console.log(img);
  //   console.log(URL);
  //   const options: FileUploadOptions = {
  //     fileKey: 'archivo',
  //     headers:{
  //       'x-token': ''//usuario.token
  //     }
  //   };

  //   const fileTransferObject: FileTransferObject = this.fileTransfer.create();

  //   fileTransferObject.upload( img, `${ URL }/upload`, options)
  //     .then( data => {
  //       console.log(data);
  //     }).catch(ex => {
  //       console.log('Error en la carga', ex);
  //     });
  // }

  addFileToApp( data:any ){
    return this.http.post(`${ URL }/upload`, data)
  }

}
