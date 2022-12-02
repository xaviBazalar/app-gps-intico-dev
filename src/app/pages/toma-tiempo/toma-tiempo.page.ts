import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserModel } from 'src/app/models/user';
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

  constructor(private modalController: ModalController,
              private taskService: TaskService,
              private storageService: StorageService,
              private modalCtrl: ModalController
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

  aceptar(){
    
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

    this.task.fechaRegistro = this.tiempoDesde;
    this.task.tipo = this.motivo;
    this.task.latitude = 0;
    this.task.longitude = 0;
    this.task.nivel = 0;
    this.task.user = this.idUser;
    this.task.task = this.idTarea;
    this.task.machine = this.idMaquina

    this.taskService.guardarTaskEvent(this.task);

    this.task.nivel = 1;
    this.task.fechaRegistro = this.tiempoHasta;

    this.taskService.guardarTaskEvent(this.task);

    this.modalController.dismiss();
    return true;
  }

  async mostrarMap(){
    console.log(this.idTarea);
    const modal = this.modalCtrl.create({
      component: MapPage,
      componentProps: {
        idTarea: this.idTarea
      }
    });
  
    (await modal).present();
  }

}
