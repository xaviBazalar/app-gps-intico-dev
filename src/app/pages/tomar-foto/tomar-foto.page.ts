import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import { PhotoService } from '../../services/photo.service';
import { EvidenceModel } from '../../models/evidence'
import { environment } from 'src/environments/environment';
import { EvidenceService } from 'src/app/services/evidence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

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
  @Input() retorno;

  baseUrl:string = environment.url;

  constructor(private camera: Camera, 
              private modalController: ModalController, 
              private photoService: PhotoService,
              private evidenceService: EvidenceService,
              private _route: ActivatedRoute,
              private router: Router,
              private storageService: StorageService,
              private alertController: AlertController
              ) { }

  ngOnInit() {
    this.loadUser()
  }

  async loadUser(): Promise<void>{
    let userData = this.storageService.loadUser();
    const [user] = await Promise.all([userData])

    const dataUser = user;
    if(dataUser){
      this.idUser = dataUser[0].uid;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    // evidence
    //this.loadUser()
    let _idTarea: String | null = this._route.snapshot.paramMap.get("idTarea");
    if(!this.idTarea){
      this.idTarea = _idTarea
    }

    let userData = this.storageService.loadUser();
    const [user] = await Promise.all([userData])

    const dataUser = user;
    if(dataUser){
      this.idUser = dataUser[0].uid;
    }

    /*let _idUser: String | null = this._route.snapshot.paramMap.get("idUser");
    if(!this.idUser){
      this.idUser = _idUser
    }*/

    console.log('idTarea',this.idTarea);
    console.log('idUser',this.idUser);

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

  async alertMessage(mensaje: string) {
    const head = mensaje

    const alert = await this.alertController.create({
      header: head,
      cssClass: 'custom-alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          cssClass: 'alert-button-confirm',
          role: '1',
        },
      ],
    });

    await alert.present();

    return true;
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
          this.alertMessage("Imagen cargada!")
          console.log(evi.evidenceDB)
        }
      });
    });
    
    
    this.templateImages.push(dataImg);
  }

  async cerrar(){
    let dataRetorno=await this.storageService.loadDataRetorno()
    let dataRetornoMaquina=await this.storageService.loadDataRetornoMaquina()

    //console.log(dataRetorno)
    //return

    dataRetorno=(dataRetorno==null || dataRetorno==undefined || dataRetorno=="")?"":dataRetorno
    dataRetornoMaquina=(dataRetornoMaquina==null || dataRetornoMaquina==undefined || dataRetornoMaquina=="")?"":dataRetornoMaquina
    this.modalController.dismiss().then().catch(()=>{
      let _retorno: String | null = this._route.snapshot.paramMap.get("retorno");
      if(!this.retorno){
        this.retorno = _retorno
      }

      this.retorno=(this.retorno==null || this.retorno=="")?dataRetornoMaquina:this.retorno
      if(_retorno!=null && _retorno!=undefined && _retorno!=""){
        this.router.navigateByUrl('/' + _retorno+dataRetorno);
      }else if(dataRetorno==""){
        this.router.navigateByUrl('/' + this.retorno);
      }else{
        this.router.navigateByUrl('/toma-tiempo' + this.retorno+dataRetorno);
      }
      
    });;
    return true;
  }

  async aceptar(){
    let dataRetorno=await this.storageService.loadDataRetorno()
    let dataRetornoMaquina=await this.storageService.loadDataRetornoMaquina()

    dataRetorno=(dataRetorno==null || dataRetorno==undefined || dataRetorno=="")?"":dataRetorno
    dataRetornoMaquina=(dataRetornoMaquina==null || dataRetornoMaquina==undefined || dataRetornoMaquina=="")?"":dataRetornoMaquina
    this.modalController.dismiss().then().catch(()=>{
      let _retorno: String | null = this._route.snapshot.paramMap.get("retorno");
      if(!this.retorno){
        this.retorno = _retorno
      }

      this.retorno=(this.retorno==null || this.retorno=="")?dataRetornoMaquina:this.retorno
      if(_retorno!=null && _retorno!=undefined && _retorno!=""){
        this.router.navigateByUrl('/' + _retorno+dataRetorno);
      }else if(dataRetorno==""){
        this.router.navigateByUrl('/' + this.retorno);
      }else{
        this.router.navigateByUrl('/toma-tiempo' + this.retorno+dataRetorno);
      }
    });;
    return true;
  }

}
