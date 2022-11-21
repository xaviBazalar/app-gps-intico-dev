import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ModalController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';

declare let window: any;

@Component({
  selector: 'app-tomar-foto',
  templateUrl: './tomar-foto.page.html',
  styleUrls: ['./tomar-foto.page.scss'],
})
export class TomarFotoPage implements OnInit {
  templateImages: string[] = [];

  constructor(private camera: Camera, private modalController: ModalController, public photoService: PhotoService) { }

  ngOnInit() {
  }

  camara(){
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.procesarImagen(options);
  }

  galeria(){
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.procesarImagen(options);
  }

  async procesarImagen(options: CameraOptions){
    
    const dataImg = await this.camera.getPicture(options).then((imageData) => { 
      return window.Ionic.WebView.convertFileSrc(imageData);
    })

    const formData = new FormData();
    const imgBlob = await fetch(dataImg).then(r => r.blob());
    console.log(imgBlob);
    formData.append('archivo', imgBlob);
    
    this.photoService.addFileToApp(formData).subscribe((data:any) => {
      console.log(data)
    });
    
    
    this.templateImages.push(dataImg);
  }

  cerrar(){
    this.modalController.dismiss();
    return true;
  }

  aceptar(){
    
    this.modalController.dismiss();
    return true;
  }

}
