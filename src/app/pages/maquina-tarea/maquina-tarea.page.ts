import { Component, Input, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { TomarFotoPage } from '../tomar-foto/tomar-foto.page';
import { TomaTiempoPage } from '../toma-tiempo/toma-tiempo.page';
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';
// import { PositionError } from '@awesome-cordova-plugins/geolocation';
import { BehaviorSubject } from 'rxjs';
import { MaquinariaService } from '../../services/maquinaria.service';
import { MaquinariaModel } from '../../models/maquinaria'
import { TaskEventsModel } from '../../models/taskEvents';
import { TaskService } from 'src/app/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-maquina-tarea',
  templateUrl: './maquina-tarea.page.html',
  styleUrls: ['./maquina-tarea.page.scss'],
})
export class MaquinaTareaPage implements OnInit {
  maquinaModel: MaquinariaModel = new MaquinariaModel;
  taskEventsModel: TaskEventsModel = new TaskEventsModel;
  taskEvent: TaskEventsModel = new TaskEventsModel;

  cargandoGeo = false;
  flagOperativo = false;
  flagPausa = false;
  flagDetencion = false;

  timeOperativo: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timerOperativo: number = 0;
  intervalOperativo;
  stateOperativo: 'start' | 'stop' = 'stop';

  timePausa: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timerPausa: number = 0;
  intervalPausa;
  statePausa: 'start' | 'stop' = 'stop';

  timeDetencion: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timerDetencion: number = 0;
  intervalDetencion;
  stateDetencion: 'start' | 'stop' = 'stop';

  tipoOperativo: String = '';
  tipoPausa: String = '';
  tipoDetencion: String = '';
  operativo:Boolean = false;

  @Input() idMaquina;
  @Input() idUser;
  @Input() idTarea;
  @Input() idMaquinaInterna;

  constructor(private modalController: ModalController,
              private menuController: MenuController,
              private modalCtrl: ModalController,
              private geoLocation: Geolocation,
              private maquinariaSrv: MaquinariaService,
              private taskServise: TaskService,
              private alertController: AlertController,
              private _route: ActivatedRoute,
              private router: Router
              ) {
    //this.menuController.enable(false);

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // console.log('--->', this.idMaquinaInterna)
    let _idMaquina: String | null = this._route.snapshot.paramMap.get("idMaquina");
    let _idUser: String | null = this._route.snapshot.paramMap.get("idUser");
    let _idTarea: String | null = this._route.snapshot.paramMap.get("idTarea");
    let _idMaquinaInterna: String | null = this._route.snapshot.paramMap.get("idMaquinaInterna");

    if(!this.idMaquinaInterna){
      this.idMaquinaInterna = _idMaquinaInterna
    }

    if(!this.idTarea){
      this.idTarea = _idTarea;
    }

    if(!this.idUser){
      this.idUser = _idUser;
    }

    if(!this.idMaquina){
      this.idMaquina = _idMaquina;
    }

    this.getGep(this.idMaquinaInterna);//'4656765'
  }

  async finalizar(){
    const fin=await this.modalCtrl.dismiss({
      'dismissed': true
    }).then().catch(data=>{
      this.router.navigate(['/inicio'])
    })
  }

  //#region "submodulos"
  async abrirTomarFoto() {
    const modal = this.modalCtrl.create({
      component: TomarFotoPage,
      componentProps: {
        idTarea: this.idTarea,
        idUser: this.idUser
      }
    });
    (await modal).present();
  }

  async abrirTomarTiempo() {
    const modal = this.modalCtrl.create({
      component: TomaTiempoPage,
      componentProps: {
        idTarea: this.idTarea,
        idMaquinaInterna: this.idMaquinaInterna,
        idMaquina: this.idMaquina
      }
    });
    (await modal).present();
  }
  //#endregion "submodulos"

  //#region "obtener ubicacion de la maquina"
  getGep(idMachine: string){

    this.cargandoGeo = true;

    // this.geoLocation.getCurrentPosition().then((resp) => {
    //   this.cargandoGeo = false;
    //   const coords = `${ resp.coords.latitude },${ resp.coords.longitude }`;
    //   this.post.coords = coords;
    //   console.log(coords);
    //  }).catch((error) => {
    //    console.log('Error getting location', error);
    //    this.cargandoGeo = false;
    //  });

    this.maquinariaSrv.obtenerUbicacion(idMachine).subscribe( (data:any) => {
    const result = data.result;
    // console.log('--flespi--', result[0]);
    const { telemetry } = result[0];
    const { 'device.name': nameMachine,'engine.ignition.status': status } = telemetry;
    const { latitude, longitude, speed } = telemetry.position;
    const coords = `${ latitude },${ longitude }`;

    this.maquinaModel.nombre = nameMachine;
    this.maquinaModel.latitude = latitude;
    this.maquinaModel.longitude = longitude;
    this.maquinaModel.coords = coords;

    if( speed === 0){
      this.maquinaModel.velocidad = 0;
      this.maquinaModel.movimiento = 'NO'
    }else{
      this.maquinaModel.velocidad = speed;
      this.maquinaModel.movimiento = 'SI'
    }

    if(status){
      this.maquinaModel.encendido = 'ON'
    }else{
      this.maquinaModel.encendido = 'OFF'
    }
    });
  }

  //#endregion "obtener ubicacion de la maquina"

  //#region "metodos cronometro operativo"
  async iniciarOperativo() {
    if(this.flagDetencion || this.flagPausa){
      this.alertMessage('No se puede iniciar este proceso primero detenga el preceso en ejecucion')
      return;
    }

    if(!await this.presentAlert('iniciar')){
      return;
    }

    this.flagOperativo = true;
    this.stateOperativo = 'start';
    clearInterval(this.intervalOperativo);
    this.timerOperativo = 0;
    this.intervalOperativo = setInterval(() => {
      this.updateTimerOperativo();
    },1000);

    const tipo = 'Operativo';
    this.llenarDatos(tipo);
    this.taskEventsModel.nivel = 1;
    this.tipoOperativo = this.taskEventsModel.subTipo;
    if(this.tipoOperativo==='Efectivo'){
      this.operativo = true;
    }else{
      this.operativo = false;
    }

    this.guardarTaskEvent(this.taskEventsModel, 1);
  }

  async stopTimerOperativo(){
    if(!await this.presentAlert('detener')){
      return;
    }

    clearInterval(this.intervalOperativo);
    // this.timeOperativo.next('00:00');
    this.stateOperativo = 'stop';
    this.flagOperativo = false;

    const tipo = 'Operativo';
    this.llenarDatos(tipo);

    (await this.taskServise.guardarTaskEvent(this.taskEventsModel)).subscribe((data: any) => {
      console.log(data);
    });
  }

  updateTimerOperativo(){
    this.timerOperativo++;
    let minutes: any = this.timerOperativo / 60;
    let seconds: any = this.timerOperativo % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timeOperativo.next(text);

    if(seconds === '00' && minutes !== '00'){
      this.getGep(this.idMaquinaInterna);//'4656765'

      this.taskEvent.user = this.idUser;
      this.taskEvent.machine = this.idMaquina;
      this.taskEvent.task = this.idTarea;
      this.taskEvent.latitude = this.maquinaModel.latitude;
      this.taskEvent.longitude = this.maquinaModel.longitude;
      this.taskEvent.tipo = 'Ubicacion';
      this.taskEvent.subTipo = 'Seguimiento'
      this.taskEvent.fechaRegistro = new Date();

      this.guardarTaskEvent(this.taskEvent, 0);
    }
  }
  //#endregion "metodos cronometro"

  //#region "metodos cronometro pausa"
  async iniciarPausa() {
    if(this.flagDetencion || this.flagOperativo){
      this.alertMessage('No se puede iniciar este proceso primero detenga el preceso en ejecucion')
      return;
    }

    if(!await this.presentAlert('iniciar')){
      return;
    }

    this.statePausa = 'start';
    this.flagPausa = true;
    clearInterval(this.intervalPausa);
    this.timerPausa = 0;
    this.intervalPausa = setInterval(() => {
      this.updateTimerPausa();
    },1000);

    const tipo = 'Pausa';
    this.llenarDatos(tipo);
    this.tipoPausa = this.taskEventsModel.subTipo;
    // console.log(this.tipoOperativo)
    (await this.taskServise.guardarTaskEvent(this.taskEventsModel)).subscribe((data: any) => {
      console.log(data);
    });

  }

  async stopTimerPausa(){
    if(!await this.presentAlert('detener')){
      return;
    }

    clearInterval(this.intervalPausa);
    // this.timePausa.next('00:00');
    this.statePausa = 'stop';
    this.flagPausa = false;

    const tipo = 'Pausa';
    this.llenarDatos(tipo);

    (await this.taskServise.guardarTaskEvent(this.taskEventsModel)).subscribe((data: any) => {
      console.log(data);
    });
  }

  updateTimerPausa(){
    this.timerPausa++;
    let minutes: any = this.timerPausa / 60;
    let seconds: any = this.timerPausa % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timePausa.next(text);
  }
  //#endregion "metodos cronometro pausa"

  //#region "metodos cronometro detencion"
  async iniciarDetencion(){
    if(this.flagOperativo || this.flagPausa){
      this.alertMessage('No se puede iniciar este proceso primero detenga el preceso en ejecucion')
      return;
    }

    if(!await this.presentAlert('iniciar')){
      return;
    }

    this.stateDetencion = 'start';
    this.flagDetencion = true;
    clearInterval(this.intervalDetencion);
    this.timerDetencion = 0;
    this.intervalDetencion = setInterval(() => {
      this.updateTimerDetencion();
    },1000);

    const tipo = 'Detencion';
    this.llenarDatos(tipo);
    this.tipoDetencion = this.taskEventsModel.subTipo;

    (await this.taskServise.guardarTaskEvent(this.taskEventsModel)).subscribe((data: any) => {
      console.log(data);
    });
  }

  async stopTimerDetencion(){
    if(!await this.presentAlert('detener')){
      return;
    }

    clearInterval(this.intervalDetencion);
    // this.timeDetencion.next('00:00');
    this.stateDetencion = 'stop';
    this.flagDetencion = false;

    const tipo = 'Detencion';
    this.llenarDatos(tipo);

    (await this.taskServise.guardarTaskEvent(this.taskEventsModel)).subscribe((data: any) => {
      console.log(data);
    });
  }

  updateTimerDetencion(){
    this.timerDetencion++;
    let minutes: any = this.timerDetencion / 60;
    let seconds: any = this.timerDetencion % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timeDetencion.next(text);
  }
  //#endregion "metodos cronometro detencion"

  //#region "metodo para las alertas"
  async presentAlert(tipo: string) {
    const alert = await this.alertController.create({
      header: `¿Esta seguro de querer ${ tipo }?`,
      cssClass: 'custom-alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Si',
          cssClass: 'alert-button-confirm',
          role: '1',
        },
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
          role: '0'
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    let rpta: boolean;
    if(role === '0'){
      rpta = false;
    }else{
      rpta = true;
    }

    return rpta;
  }

  async presentMessage(flag: boolean) {
    let head: string;
    if(flag){
      head = 'Se realizó con éxitó'
    }else{
      head = 'Se produjo un error'
    }

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
  //#endregion "metodo para las alertas"

  //#region "metodos"
  llenarDatos(tipo: string) {
    this.taskEventsModel.user = this.idUser;
    this.taskEventsModel.machine = this.idMaquina;
    this.taskEventsModel.task = this.idTarea;
    this.taskEventsModel.latitude = this.maquinaModel.latitude;
    this.taskEventsModel.longitude = this.maquinaModel.longitude;
    this.taskEventsModel.tipo = tipo;
    this.taskEventsModel.fechaRegistro = new Date();
    // taskEventsModel.subTipo = 'Efectivo1';

    // console.log('fechaCorta', taskEventsModel.fechaRegistro.toISOString().substring(0,10));
  }

  async guardarTaskEvent(taskEventsModel: TaskEventsModel, tipo: Number) {


    (await this.taskServise.guardarTaskEvent(taskEventsModel)).subscribe(async (data: any) => {
      console.log(data);
      if(tipo === 1){
        await this.presentMessage(data.ok);
      }
    });
  }
  //#endregion "metodos cronometro operativo"
}
