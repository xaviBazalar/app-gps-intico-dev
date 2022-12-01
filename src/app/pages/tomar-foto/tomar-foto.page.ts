import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ModalController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';
import { EvidenceModel } from '../../models/evidence'
import { environment } from 'src/environments/environment';
import { EvidenceService } from 'src/app/services/evidence.service';

declare let window: any;

@Component({
  selector: 'app-tomar-foto',
  templateUrl: './tomar-foto.page.html',
  styleUrls: ['./tomar-foto.page.scss'],
})
export class TomarFotoPage implements OnInit {
  templateImages: string[] = [];
  evidence: EvidenceModel = new EvidenceModel;
  
  @Input() idTarea;
  @Input() idUser;
  baseUrl:string = environment.url;

  constructor(private camera: Camera, 
              private modalController: ModalController, 
              private photoService: PhotoService,
              private evidenceService: EvidenceService
              ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // evidence
    this.evidenceService.obtenerEvidence(this.idTarea).subscribe((data: any) => {
      if(data.ok){
        console.log(data);
        const { evidence } = data;
        
        for(let i=0; i< evidence.length; i++){
          this.templateImages.push(evidence[i].urlImg);
        }
      }
    })
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
      //http://44.192.39.42:8080/api/upload?id=aa7e07627848c72439c4aa3d89f4031c.png
      
      this.evidence.fechaRegistro = new Date();
      this.evidence.task = this.idTarea;
      this.evidence.user = this.idUser;
      this.evidence.urlImg = this.baseUrl + `/upload?id=${ data.urlFile }`

      this.evidenceService.guardarEvidence(this.evidence)
      .subscribe((evi: any) => {
        if(!evi.ok){
          console.log(evi.msg)
        }else{
          console.log(evi.evidenceDB)
        }
      });
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
