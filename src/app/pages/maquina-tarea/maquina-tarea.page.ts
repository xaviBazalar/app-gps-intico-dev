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
import { StorageService } from 'src/app/services/storage.service';
import { TaskModel } from 'src/app/models/task';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-maquina-tarea',
  templateUrl: './maquina-tarea.page.html',
  styleUrls: ['./maquina-tarea.page.scss'],
})
export class MaquinaTareaPage implements OnInit {
  maquinaModel: MaquinariaModel = new MaquinariaModel;
  taskEventsModel: TaskEventsModel = new TaskEventsModel;
  taskEvent: TaskEventsModel = new TaskEventsModel;
  taskModel: TaskModel = new TaskModel;

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

  flagMaquinaria: boolean = false;  
  flagMaquinaGps: boolean = false;  

  idTareaEvent: String = '';

  fechaActual: String = '';
  planificacionTrabajo: String | null = '';
  turno: String | null = '';
  gerencia: String | null = '';
  division: String | null = '';
  user: String | null = '';
  contrato: String | null = '';
  tiempoSLA: String | null = '';
  tareaMaquinaria: String | null = '';
  myDate: String = (new Date).toLocaleDateString();
  titulo:String = 'TAREA A REALIZAR'
  retornoMaquinaStorage:string=""
  tiempoActualOpe:string=""
  tiempoActualStandByOpe:string=""
  tiempoActualPausa:string=""
  tiempoActualStandByPausa:string=""
  tiempoActualDetencion:string=""
  tiempoActualStandByDetencion:string=""

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
              private router: Router,
              private storageService: StorageService,
              public loadingController: LoadingController
              ) {
    //this.menuController.enable(false);
    this.fechaActual = new Date().toLocaleString()
  }

  ShowLoading() {
    this.loadingController.create({
        message: 'Cargando...'
    }).then((response) => {
        response.present();
    });
  } 
  
  dismissLoading() {
    this.loadingController.dismiss().then((response) => {
        //console.log('Loader closed!', response);
    }).catch((err) => {
        console.log('Error occured : ', err);
    });
  }

  async ngOnInit():Promise<void>{
    //:idMaquina/:idUser/:idTarea/:idMaquinaInterna
    let _idMaquina: String | null = this._route.snapshot.paramMap.get("idMaquina");
    let _idUser: String | null = this._route.snapshot.paramMap.get("idUser");
    let _idTarea: String | null = this._route.snapshot.paramMap.get("idTarea");
    let _idMaquinaInterna: String | null = this._route.snapshot.paramMap.get("idMaquinaInterna");

    this.storageService.saveDataRetornoMaquina(`maquina-tarea/${_idMaquina}/${_idUser}/${_idTarea}/${_idMaquinaInterna}`)
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
    this.ShowLoading()
    this.obtenerTarea(this.idTarea);

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
    if(!this.idTareaEvent){
      this.alertMessage('Debe primero guardar un evento');
      return;
    }

    const modal = this.modalCtrl.create({
      component: TomarFotoPage,
      componentProps: {
        idTarea: this.idTareaEvent,
        idUser: this.idUser,
        retorno: 'maquina-tarea'
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
    console.log('--flespi--', result[0]);
    const { telemetry } = result[0];
    const { 'device.name': nameMachine,'engine.ignition.status': status, 'vehicle.mileage': mileage } = telemetry;
    const { latitude, longitude, speed, altitude, direction } = telemetry.position;
    const coords = `${ latitude },${ longitude }`;

    this.maquinaModel.nombre = nameMachine;
    this.maquinaModel.latitude = latitude;
    this.maquinaModel.longitude = longitude;
    this.maquinaModel.direction = direction;
    this.maquinaModel.altitude = altitude;
    this.maquinaModel.mileage = mileage;

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
    this.dismissLoading()
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

    const fechaActual: Date = new Date();
    this.taskEventsModel.horaInicio = fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0');
    if(this.tiempoActualOpe==""){
      this.tiempoActualOpe=fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0')+ ":"+fechaActual.getSeconds().toString().padStart(2,'0');
    }else{
      let tiempoNuevoTemp:string=fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0')+ ":"+fechaActual.getSeconds().toString().padStart(2,'0')
      this.tiempoActualOpe=this.substractTimes(tiempoNuevoTemp,this.tiempoActualStandByOpe)
    }
    this.taskEventsModel.horaFin = ''
    this.taskEventsModel.distanciaInicial = this.maquinaModel.mileage;
    this.taskEventsModel.distanciaFinal = 0;

    this.tipoOperativo = this.taskEventsModel.subTipo;

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

    const fechaActual: Date = new Date();
    this.taskEventsModel.horaFin = fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0')+ ":"+fechaActual.getSeconds().toString().padStart(2,'0');
    this.taskEventsModel.distanciaFinal = this.maquinaModel.mileage;

    this.actualizarTaskEvent(this.taskEventsModel);
  }

  padNmb(nStr, nLen) {
    var sRes = String(nStr);
    var sCeros = "0000000000";
    return sCeros.substr(0, nLen - sRes.length) + sRes;
  }

  stringToSeconds(tiempo) {
      var sep1 = tiempo.indexOf(":");
      var sep2 = tiempo.lastIndexOf(":");
      var hor = tiempo.substr(0, sep1);
      var min = tiempo.substr(sep1 + 1, sep2 - sep1 - 1);
      var sec = tiempo.substr(sep2 + 1);
      return (Number(sec) + (Number(min) * 60) + (Number(hor) * 3600));
  }

  secondsToTime(secs) {
      var hor = Math.floor(secs / 3600);
      var min = Math.floor((secs - (hor * 3600)) / 60);
      var sec = secs - (hor * 3600) - (min * 60);
      return this.padNmb(hor, 2) + ":" + this.padNmb(min, 2) + ":" + this.padNmb(sec, 2);
  }

  substractTimes(t1, t2) {
      var secs1 = this.stringToSeconds(t1);
      var secs2 = this.stringToSeconds(t2);
      var secsDif = secs1 - secs2;
      return this.secondsToTime(secsDif);
  }
   

  updateTimerOperativo(){
    this.timerOperativo++;
    let minutes: any = this.timerOperativo / 60;
    let seconds: any = this.timerOperativo % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    //this.timeOperativo.next(text);

    let fechaActualActualizado: Date = new Date();
    let tiempoActualNuevo:string=fechaActualActualizado.getHours().toString().padStart(2,'0') + ':' + fechaActualActualizado.getMinutes().toString().padStart(2,'0')+ ":"+fechaActualActualizado.getSeconds().toString().padStart(2,'0');
    this.tiempoActualStandByOpe=this.substractTimes(tiempoActualNuevo,this.tiempoActualOpe)
    this.timeOperativo.next(this.substractTimes(tiempoActualNuevo,this.tiempoActualOpe));
    /*if(this.tiempoActualStandByOpe!=""){
      console.log("standby",this.tiempoActualStandByOpe+"  "+tiempoActualNuevo)
      this.timeOperativo.next(this.substractTimes(tiempoActualNuevo,this.tiempoActualStandByOpe));
    }else{
      console.log("normal",this.tiempoActualOpe+"  "+tiempoActualNuevo)
      this.timeOperativo.next(this.substractTimes(tiempoActualNuevo,this.tiempoActualOpe));
    }*/
    
    
    

    // if(seconds === '00' && minutes !== '00'){
    //   this.getGep(this.idMaquinaInterna);//'4656765'

    //   this.taskEvent.user = this.idUser;
    //   this.taskEvent.machine = this.idMaquina;
    //   this.taskEvent.task = this.idTarea;
    //   this.taskEvent.latitude = this.maquinaModel.latitude;
    //   this.taskEvent.longitude = this.maquinaModel.longitude;
    //   this.taskEvent.tipo = 'Ubicacion';
    //   this.taskEvent.subTipo = 'Seguimiento'
    //   this.taskEvent.fechaRegistro = new Date();

    //   this.guardarTaskEvent(this.taskEvent, 0);
    // }
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

    const fechaActual: Date = new Date();
    this.taskEventsModel.horaInicio = fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0');
    if(this.tiempoActualPausa==""){
      this.tiempoActualPausa=fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0')+ ":"+fechaActual.getSeconds().toString().padStart(2,'0');
    }else{
      let tiempoNuevoTemp:string=fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0')+ ":"+fechaActual.getSeconds().toString().padStart(2,'0')
      this.tiempoActualPausa=this.substractTimes(tiempoNuevoTemp,this.tiempoActualStandByPausa)
    }
    this.taskEventsModel.horaFin = '';
    this.taskEventsModel.distanciaInicial = this.maquinaModel.mileage;
    this.taskEventsModel.distanciaFinal = 0;

    this.guardarTaskEvent(this.taskEventsModel, 1);
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

    const fechaActual: Date = new Date();
    this.taskEventsModel.horaFin = fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0');
    this.taskEventsModel.distanciaFinal = this.maquinaModel.mileage;

    this.actualizarTaskEvent(this.taskEventsModel);
  }

  updateTimerPausa(){
    this.timerPausa++;
    let minutes: any = this.timerPausa / 60;
    let seconds: any = this.timerPausa % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    //this.timePausa.next(text);
    let fechaActualActualizado: Date = new Date();
    let tiempoActualNuevo:string=fechaActualActualizado.getHours().toString().padStart(2,'0') + ':' + fechaActualActualizado.getMinutes().toString().padStart(2,'0')+ ":"+fechaActualActualizado.getSeconds().toString().padStart(2,'0');
    this.tiempoActualStandByPausa=this.substractTimes(tiempoActualNuevo,this.tiempoActualPausa)
    this.timePausa.next(this.substractTimes(tiempoActualNuevo,this.tiempoActualPausa));
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
    const fechaActual: Date = new Date();
    this.taskEventsModel.horaInicio = fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0');
    if(this.tiempoActualDetencion=""){
      this.tiempoActualDetencion=fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0')+ ":"+fechaActual.getSeconds().toString().padStart(2,'0');
    }else{
      let tiempoNuevoTemp:string=fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0')+ ":"+fechaActual.getSeconds().toString().padStart(2,'0')
      this.tiempoActualDetencion=this.substractTimes(tiempoNuevoTemp,this.tiempoActualStandByDetencion)
    }
    this.taskEventsModel.horaFin = ''
    this.taskEventsModel.distanciaInicial = this.maquinaModel.mileage;
    this.taskEventsModel.distanciaFinal = 0;

    this.tipoDetencion = this.taskEventsModel.subTipo;

    this.guardarTaskEvent(this.taskEventsModel, 1);
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

    const fechaActual: Date = new Date();
    this.taskEventsModel.horaFin = fechaActual.getHours().toString().padStart(2,'0') + ':' + fechaActual.getMinutes().toString().padStart(2,'0');
    this.taskEventsModel.distanciaFinal = this.maquinaModel.mileage;

    this.actualizarTaskEvent(this.taskEventsModel);
  }

  updateTimerDetencion(){
    this.timerDetencion++;
    let minutes: any = this.timerDetencion / 60;
    let seconds: any = this.timerDetencion % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    //this.timeDetencion.next(text);
    let fechaActualActualizado: Date = new Date();
    let tiempoActualNuevo:string=fechaActualActualizado.getHours().toString().padStart(2,'0') + ':' + fechaActualActualizado.getMinutes().toString().padStart(2,'0')+ ":"+fechaActualActualizado.getSeconds().toString().padStart(2,'0');
    this.tiempoActualStandByDetencion=this.substractTimes(tiempoActualNuevo,this.tiempoActualDetencion)
    this.timeDetencion.next(this.substractTimes(tiempoActualNuevo,this.tiempoActualDetencion));
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
    
  }

  obtenerTarea(idTarea: string){
    this.taskServise.getTaskId(idTarea).subscribe((data: any) => {
      if(data.ok){
        this.dismissLoading()
        // this.taskModel = data.task[0];
        console.log('taskmodel', data.task[0]);
        const { planificacionTrabajo } = data.task[0];
        this.planificacionTrabajo = planificacionTrabajo.descripcion;
        this.turno = data.task[0].turno
        const { gerencia } = data.task[0];
        this.gerencia = gerencia.descripcion;
        const { division } = data.task[0];
        this.division = division.descripcion;
        const { user } = data.task[0];
        this.user = user.nombre
        const { contrato } = data.task[0];
        this.contrato = contrato.descripcion        
        this.tiempoSLA = data.task[0].tiempoSLA
        this.tareaMaquinaria = data.task[0].tareaMaquinaria
        
      }else{
        this.dismissLoading()
      }
    })
  }

  mostrarOcultarMaq(){
    if(this.flagMaquinaria){
      this.flagMaquinaria = false;
    }else{
      this.flagMaquinaria = true;
    }
  }

  mostrarOcultarGps(){
    if(this.flagMaquinaGps){
      this.flagMaquinaGps = false;
    }else{
      this.flagMaquinaGps = true;
    }
  }
  
  async guardarTaskEvent(taskEventsModel: TaskEventsModel, tipo: Number) {
    (await this.taskServise.guardarTaskEvent(taskEventsModel)).subscribe(async (data: any) => {
      console.log('guardado', data);
      const { taskDB } = data;

      if(data.ok){
        this.idTareaEvent = taskDB.uid;
        await this.storageService.saveTaskEvent(taskDB);
      }


      if(tipo === 1){
        await this.presentMessage(data.ok);
      }
    });
  }

  async actualizarTaskEvent(taskEventsModel: TaskEventsModel){
    let taskData=this.storageService.loadTask();
    const [task] = await Promise.all([taskData]);

    taskEventsModel.uid = task.uid;

    (await this.taskServise.actualizarTaskEvent(taskEventsModel)).subscribe(async (data: any) => {
      console.log(data);
      const { taskDB } = data;

      if(data.ok){        
        await this.storageService.saveTaskEvent(taskDB);
      }

        await this.presentMessage(data.ok);
    });
  }
  //#endregion "metodos cronometro operativo"
}
