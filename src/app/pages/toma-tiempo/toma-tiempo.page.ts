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
  idTareaEvent: String = '';

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

    const fechaDesdeX = new Date(dateA.value);
    fechaDesdeX.setMilliseconds(0);
    fechaDesdeX.setSeconds(0);

    const fechaHastaX = new Date(dateB.value);
    fechaHastaX.setMilliseconds(0);
    fechaHastaX.setSeconds(0);

    const fechaHoy: Date = new Date();

    //Las fechas deben ser diferentes
    if(fechaDesdeX === fechaHastaX){
      this.alertMessage('Las horas deben ser diferentes');
      return;
    }
    //La fecha desde debe ser menor a la fecha hasta
    if(fechaDesdeX > fechaHastaX){
      this.alertMessage('Las fecha de desde debe ser menor a la fecha hasta');
      return;
    }
    //la fecha debe ser menor a la fecha actual
    if(fechaDesdeX > fechaHoy){
      this.alertMessage( 'La fecha desde debe de ser menor o igual al día actual ' + fechaHoy.toLocaleDateString() );
      return;
    }
    if(fechaHastaX > fechaHoy){
      this.alertMessage( 'La fecha hasta debe de ser menor o igual al día actual ' + fechaHoy.toLocaleDateString() );
      return;
    }

    if(fechaDesdeX.toLocaleDateString() !== fechaHastaX.toLocaleDateString()){
      this.alertMessage('Las fechas deben de ser el mismo día ');// + fechaDesdeX.toString() + '|' + fechaHastaX.toString()
      return;
    }

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
    
    let dataA:any=await this.maquinaService.obtenerUbicaTiempo(this.idMaquinaInterna, fechaDesdeTS.toString(), fechaDesdeATS.toString()).toPromise()

    const { result:resultA } = dataA;

    if(resultA.length > 0){      
        const {'position.latitude': _latitude, 'position.longitude': _longitude, 'vehicle.mileage': _milage} = resultA[0];        
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
        this.task.distanciaInicial = _milage;

        console.log('latitude',_latitude);
        console.log('longitude',_longitude);
        console.log('milage',_milage);
    } 
   /*(this.maquinaService.obtenerUbicaTiempo(this.idMaquinaInterna, fechaDesdeTS.toString(), fechaDesdeATS.toString())).subscribe((data: any) => {
      console.log('desde',data)
      const { result } = data;

      if(result.length > 0){      
        const {'position.latitude': _latitude, 'position.longitude': _longitude, 'vehicle.mileage': _milage} = result[0];        
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
        this.task.distanciaInicial = _milage;

        console.log('latitude',_latitude);
        console.log('longitude',_longitude);
        console.log('milage',_milage);
      }
    });*/
    
    let dataB:any= await this.maquinaService.obtenerUbicaTiempo(this.idMaquinaInterna, fechaHastaTS.toString(), fechaHastaATS.toString()).toPromise()
    const { result } = dataB

    if(result.length > 0){
        const {'position.latitude': _latitude, 'position.longitude': _longitude, 'vehicle.mileage': _milage} = result[0]
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
        this.task.distanciaFinal = _milage;

        console.log('latitude2',_latitude);
        console.log('longitude2',_longitude);
        console.log('milage2',_milage);
    }
    /*(this.maquinaService.obtenerUbicaTiempo(this.idMaquinaInterna, fechaHastaTS.toString(), fechaHastaATS.toString())).subscribe((data: any) => {
      console.log('hasta', data)
      const { result } = data

      if(result.length > 0){
        const {'position.latitude': _latitude, 'position.longitude': _longitude, 'vehicle.mileage': _milage} = result[0]
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
        this.task.distanciaFinal = _milage;

        console.log('latitude2',_latitude);
        console.log('longitude2',_longitude);
        console.log('milage2',_milage);
      }
    });*/

    this.task.horaInicio = fechaDesde.getHours().toString().padStart(2,'0') + ':' + fechaDesde.getMinutes().toString().padStart(2,'0');
    this.task.horaFin = fechaHasta.getHours().toString().padStart(2,'0') + ':' + fechaHasta.getMinutes().toString().padStart(2,'0');

    fechaDesde.setHours(0);
    fechaDesde.setMinutes(0);
    fechaHasta.setHours(0);
    fechaHasta.setMinutes(0);    
    
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
    this.task.nivel = 0;

    this.task.fechaRegistro = fechaDesde;//new Date();

    this.taskService.guardarTaskEvent(this.task).subscribe((data: any) => {
      console.log(data);
      const { taskDB } = data;
      console.log(taskDB)
      if(data.ok){
        this.idTareaEvent = taskDB.uid
        this.storageService.saveTaskEvent(taskDB);
      }
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
    this.router.navigate(['/reporte-diario', { idTarea: this.idTarea, machine: this.idMaquina }]);
  }

  mostrarEvidencia(){
    if(!this.idTareaEvent){
      this.alertMessage('Debe primero guardar el evento');
      return;
    }

    this.modalController.dismiss();
    this.router.navigate(['/tomar-foto',  { idTarea: this.idTareaEvent }])
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

  cerrar()
  {
    this.modalController.dismiss();
    return true;
  }
}
