import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { UserModel } from 'src/app/models/user';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { StorageService } from 'src/app/services/storage.service';
import { TaskService } from 'src/app/services/task.service';
import { TaskEventsModel } from '../../models/taskEvents';
import { MapPage } from '../map/map.page'

@Component({
  selector: 'app-toma-tiempo',
  templateUrl: './toma-tiempo.page.html',
  styleUrls: ['./toma-tiempo.page.scss'],
})
export class TomaTiempoPage implements OnInit {
  myDate: any;
  tiempoDesde: Date = new Date();
  tiempoHasta: Date = new Date();
  motivo: String = '';
  subMotivoOpe: String = '';
  subMotivoPau: String = '';
  subMotivoDet: String = '';
  task: TaskEventsModel = new TaskEventsModel;
  idUser: String = '';
  link: String = '';

  @Input() idTarea;
  @Input() idMaquina;
  @Input() idMaquinaInterna;

  constructor(private modalController: ModalController,
              private taskService: TaskService,
              private storageService: StorageService,
              private router: Router,
              private maquinaService: MaquinariaService,
              private alertController: AlertController
              ) {
    this.myDate = new Date().toString();
    console.log(this.myDate);
   }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    let userData = this.storageService.loadUser();
    const [user] = await Promise.all([userData])

    const dataUser = user;

    if(dataUser){
      this.idUser = dataUser[0].uid;
    }

    this.link = `/map?idTarea=${ this.idTarea }`
  }

  async aceptar(){
    const dateA:any = document.getElementById('date')
    const dateB:any = document.getElementById('date1')

    if(!dateA.value){
      this.alertMessage('Debe cambiar la hora de inicio');
      return;
    }

    if(!dateB.value){
      this.alertMessage('Debe cambiar la hora de fin');
      return;
    }

    switch (this.motivo) {
      case "Operativo":
        this.task.subTipo = this.subMotivoOpe;
        break;
      case "Pausa":
        this.task.subTipo = this.subMotivoPau;
        break;
      case "Detencion":
        this.task.subTipo = this.subMotivoDet;
        break;
      default:
        break;
    }

    this.task.tipo = this.motivo;
    this.task.user = this.idUser;
    this.task.task = this.idTarea;
    this.task.machine = this.idMaquina

    let fechaDesde = new Date(dateA.value);
    fechaDesde.setSeconds(0)
    fechaDesde.setMilliseconds(0)

    let fechaDesdeA = new Date(dateA.value);
    fechaDesdeA.setSeconds(59)
    fechaDesdeA.setMilliseconds(0)

    let fechaHasta = new Date(dateB.value);
    fechaHasta.setSeconds(0)
    fechaHasta.setMilliseconds(0)

    let fechaHastaA = new Date(dateB.value);
    fechaHastaA.setSeconds(59)
    fechaHastaA.setMilliseconds(0)

    const fechaDesdeTS = (fechaDesde).getTime() / 1000;
    const fechaHastaTS = (fechaHasta).getTime() / 1000;
    const fechaDesdeATS = (fechaDesdeA).getTime() / 1000;
    const fechaHastaATS = (fechaHastaA).getTime() / 1000;

    (await this.maquinaService.obtenerUbicaTiempo(this.idMaquinaInterna, fechaDesdeTS.toString(), fechaDesdeATS.toString())).subscribe((data: any) => {
      console.log('desde',data)
      const { result } = data;
      const i = result.length - 1;

      if(i>0){
        const {'position.latitude': _latitude, 'position.longitude': _longitude} = result[i];        
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
      }
    });
    
    this.task.nivel = 0;
    this.task.fechaRegistro = dateA.value;
    
    (await this.taskService.guardarTaskEvent(this.task)).subscribe((data: any) => {
      console.log(data);
    });

    (await this.maquinaService.obtenerUbicaTiempo(this.idMaquinaInterna, fechaHastaTS.toString(), fechaHastaATS.toString())).subscribe((data: any) => {
      console.log('hasta', data)
      const { result } = data
      const i = result.length - 1;
      if(i>0){
        const {'position.latitude': _latitude, 'position.longitude': _longitude} = result[i]
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
      }
    });

    this.task.nivel = 1;
    this.task.fechaRegistro = dateB.value;

    (await this.taskService.guardarTaskEvent(this.task)).subscribe((data: any) => {
      console.log(data);
    });

    // this.modalController.dismiss();
    return true;
  }

  async mostrarMap(){
    this.modalController.dismiss();
    this.router.navigate(['/map', { idTarea: this.idTarea }]);
  }

  mostrarReporte(){
    this.modalController.dismiss();
    this.router.navigate(['/reporte-diario', { idTarea: this.idTarea }]);
  }

  mostrarEvidencia(){
    this.modalController.dismiss();
    this.router.navigate(['/tomar-foto',  { idTarea: this.idTarea }])
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
}
