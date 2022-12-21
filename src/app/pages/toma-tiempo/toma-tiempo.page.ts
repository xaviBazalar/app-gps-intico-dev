import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { UserModel } from 'src/app/models/user';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { StorageService } from 'src/app/services/storage.service';
import { TaskService } from 'src/app/services/task.service';
import { TaskEventsModel } from '../../models/taskEvents';
import { MapPage } from '../map/map.page'
import { LoadingController } from '@ionic/angular';

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
  btnUpdate:boolean=false

  tiempoDesdeDefault:any=""
  tiempoHastaDefault:any=""
  intervalDismiss:any

  @Input() idTarea;
  @Input() idMaquina;
  @Input() idMaquinaInterna;
  @Input() loadingControllerParent; 

  constructor(private modalController: ModalController,
              private taskService: TaskService,
              private storageService: StorageService,
              private router: Router,
              private route: ActivatedRoute,
              private maquinaService: MaquinariaService,
              private alertController: AlertController,
              public loadingController: LoadingController
              ) {
    this.myDate = new Date().toString();
    this.storageService.saveDataRetorno("")
    console.log(this.myDate);
    this.afterLoad()
    if(this.loadingControllerParent!==null && this.loadingControllerParent!==undefined){
      this.loadingController=this.loadingControllerParent;
    }
  }

  ShowLoading() {
    this.loadingController.create({
        message: 'Cargando...'
    }).then((response) => {
        response.present();
    });
  } 
  

  /*dismissLoading() {
    this.loadingController.dismiss();
  }*/

  dismissLoading() {
    this.intervalDismiss=setInterval(()=>{ this.loadingController.dismiss().then((response) => {
        //console.log('Loader closed!', response);
        clearInterval(this.intervalDismiss)
    }).catch((err) => {
        console.log('Error occured : ', err);
    })},1000);
  }

  async ngOnInit() :Promise<void>{
    await this.afterLoad()
    
  }

  async afterLoad():Promise<void>{
    this.idTarea= (this.route.snapshot.paramMap.get("idTarea")!=undefined)?this.route.snapshot.paramMap.get("idTarea"):this.idTarea;
    this.idMaquina = (this.route.snapshot.paramMap.get("machine")!=undefined)?this.route.snapshot.paramMap.get("machine"):this.idMaquina;
    this.idMaquinaInterna = (this.route.snapshot.paramMap.get("machineIdInterno")!=undefined)?this.route.snapshot.paramMap.get("machineIdInterno"):this.idMaquinaInterna;
    
    if(this.idMaquina!=""){
      let fecha:any=this.route.snapshot.paramMap.get("fecha")
      let uid:any=this.route.snapshot.paramMap.get("uid")
      let horaIni:any=this.route.snapshot.paramMap.get("horaInicio")
      let horaFin:any=this.route.snapshot.paramMap.get("horaFin")
      this.taskService.getTaskEventReporte(fecha,this.idMaquina).subscribe((data:any)=>{
        let taskEvent:any=data.taskEvent.filter((data:any)=>{
          return data.uid==uid
        })
        console.log(taskEvent)
        console.log(taskEvent.length)
        console.log(horaIni)
        if(taskEvent.length>0 && (horaIni==null || horaIni=="")){
          console.log("si")
          this.task.uid=taskEvent[0].uid
          this.tiempoDesdeDefault=`${fecha}T${taskEvent[0].horaInicio}:00.000`
          this.tiempoHastaDefault=`${fecha}T${taskEvent[0].horaFin}:00.000`
          //console.log(this.tiempoHastaDefault)
          this.btnUpdate=true
          this.idTareaEvent=taskEvent[0].uid
          let dataRetorno:string=`;idTarea=${this.idTarea};machine=${this.idMaquina};machineIdInterno=${this.idMaquinaInterna};tipo=${this.route.snapshot.paramMap.get("tipo")};subtipo=${this.route.snapshot.paramMap.get("subtipo")};fecha=${fecha};uid=${uid}`
          this.storageService.saveDataRetorno(dataRetorno)
          this.storageService.saveDataRetornoMaquina("")
  
        }else{
          console.log("no")
          
          this.task.uid=uid
          this.tiempoDesdeDefault=`${fecha}T${horaIni}:00.000`
          this.tiempoHastaDefault=`${fecha}T${horaIni}:00.000`
          this.loadUser()
        }
      })
    }
  }

  async loadUser(): Promise<void>{
    let userData = this.storageService.loadUser();
    const [user] = await Promise.all([userData])

    const dataUser = user;
    console.log(dataUser)
    if(dataUser){
      this.idUser = dataUser[0].uid;
    }
  }

  async ngAfterViewInit(): Promise<void> {
    let userData = this.storageService.loadUser();
    const [user] = await Promise.all([userData])

    const dataUser = user;
    if(dataUser){
      this.idUser = dataUser[0].uid;
    }

    this.link = `/map?idTarea=${ this.idTarea }`
    if(this.route.snapshot.paramMap.get("tipo")!=undefined && this.route.snapshot.paramMap.get("tipo")!=""){
      this.motivo=String(this.route.snapshot.paramMap.get("tipo"))
    }

    if(this.route.snapshot.paramMap.get("subtipo")!=undefined && this.route.snapshot.paramMap.get("subtipo")!=""){
      if(this.route.snapshot.paramMap.get("tipo")=="Operativo"){
        this.subMotivoOpe=String(this.route.snapshot.paramMap.get("subtipo"))
      }

      if(this.route.snapshot.paramMap.get("tipo")=="Pausa"){
        this.subMotivoPau=String(this.route.snapshot.paramMap.get("subtipo"))
      }

      if(this.route.snapshot.paramMap.get("tipo")=="Detencion"){
        this.subMotivoDet=String(this.route.snapshot.paramMap.get("subtipo"))
      }
    }
  
      
  }

  

  async actualizar(){
    const loader= await this.ShowLoading()
    const dateA:any = document.getElementById('date')
    const dateB:any = document.getElementById('date1')

    if(!dateA.value){
      this.alertMessage('Debe cambiar la hora de inicio');
      this.dismissLoading();
      return;
    }

    if(!dateB.value){
      this.alertMessage('Debe cambiar la hora de fin');
      this.dismissLoading();
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
      this.dismissLoading();
      return;
    }
    //La fecha desde debe ser menor a la fecha hasta
    if(fechaDesdeX > fechaHastaX){
      this.alertMessage('Las fecha de desde debe ser menor a la fecha hasta');
      this.dismissLoading();
      return;
    }
    //la fecha debe ser menor a la fecha actual
    if(fechaDesdeX > fechaHoy){
      this.alertMessage( 'La fecha desde debe de ser menor o igual al día actual ' + fechaHoy.toLocaleDateString() );
      this.dismissLoading();
      return;
    }
    if(fechaHastaX > fechaHoy){
      this.alertMessage( 'La fecha hasta debe de ser menor o igual al día actual ' + fechaHoy.toLocaleDateString() );
      this.dismissLoading();
      return;
    }

    if(fechaDesdeX.toLocaleDateString() !== fechaHastaX.toLocaleDateString()){
      this.alertMessage('Las fechas deben de ser el mismo día ');// + fechaDesdeX.toString() + '|' + fechaHastaX.toString()
      this.dismissLoading();
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
    console.log('desde',dataA)
    const { result:resultA } = dataA;

    if(resultA.length > 0){      
        const {'position.latitude': _latitude, 'position.longitude': _longitude, 'vehicle.mileage': _milage} = resultA[0];        
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
        this.task.distanciaInicial = _milage;
    } 
    
    let dataB:any= await this.maquinaService.obtenerUbicaTiempo(this.idMaquinaInterna, fechaHastaTS.toString(), fechaHastaATS.toString()).toPromise()
    const { result } = dataB
    console.log('hasta', dataB)
    if(result.length > 0){
        const {'position.latitude': _latitude, 'position.longitude': _longitude, 'vehicle.mileage': _milage} = result[0]
        this.task.latitude = _latitude;
        this.task.longitude = _longitude;
        this.task.distanciaFinal = _milage;
    }

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


    this.taskService.actualizarTaskEvent(this.task).subscribe(
      (data: any) => {
        const { taskEventActualizado } = data;
        if(data.ok){
          this.dismissLoading()
          this.idTareaEvent = taskEventActualizado.uid
          //this.storageService.saveTaskEvent(taskEventActualizado);
          this.alertMessage("Información actualizada!")
        }
      },
      (err) => {
        this.dismissLoading()
        console.log('error',err)
      }
      );

    // this.modalController.dismiss();
    return true;
  }

  async aceptar(){
    const loader= await this.ShowLoading()
    
    const dateA:any = document.getElementById('date')
    const dateB:any = document.getElementById('date1')

    if(!dateA.value){
      this.alertMessage('Debe cambiar la hora de inicio');
      this.dismissLoading();
      return;
    }

    if(!dateB.value){
      this.alertMessage('Debe cambiar la hora de fin');
      this.dismissLoading();
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
      this.dismissLoading();
      return;
    }
    //La fecha desde debe ser menor a la fecha hasta
    if(fechaDesdeX > fechaHastaX){
      this.alertMessage('Las fecha de desde debe ser menor a la fecha hasta');
      this.dismissLoading();
      return;
    }
    //la fecha debe ser menor a la fecha actual
    if(fechaDesdeX > fechaHoy){
      this.alertMessage( 'La fecha desde debe de ser menor o igual al día actual ' + fechaHoy.toLocaleDateString() );
      this.dismissLoading();
      return;
    }
    if(fechaHastaX > fechaHoy){
      this.alertMessage( 'La fecha hasta debe de ser menor o igual al día actual ' + fechaHoy.toLocaleDateString() );
      this.dismissLoading();
      return;
    }

    if(fechaDesdeX.toLocaleDateString() !== fechaHastaX.toLocaleDateString()){
      this.alertMessage('Las fechas deben de ser el mismo día ');// + fechaDesdeX.toString() + '|' + fechaHastaX.toString()
      this.dismissLoading();
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
    console.log('desde',dataA)
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
    console.log('hasta', dataB)
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

    let fecha:any=this.route.snapshot.paramMap.get("fecha")
    

    
    

    this.taskService.guardarTaskEvent(this.task).subscribe(
      (data: any) => {
        console.log(data);
        const { taskDB } = data;
        console.log(taskDB)
        if(data.ok){
          this.dismissLoading()
          if(fecha!=null && fecha!=undefined && fecha!=""){
            //this.tiempoDesdeDefault=`${fecha}T${this.task.horaInicio}:00.000`
            //this.tiempoHastaDefault=`${fecha}T${this.task.horaFin}:00.000`
            let dataRetorno:string=`;idTarea=${taskDB.task};machine=${taskDB.machine};machineIdInterno=${this.idMaquinaInterna};tipo=${this.task.tipo};subtipo=${this.task.subTipo};fecha=${fecha};uid=${taskDB.uid};`
      
            this.storageService.saveDataRetorno(dataRetorno)
            this.storageService.saveDataRetornoMaquina("")
          }
          this.alertMessage("Información Agregada!")
          this.idTareaEvent = taskDB.uid
          this.storageService.saveTaskEvent(taskDB);
        }else{
          this.dismissLoading();
          this.alertMessage(data.msg)
        }
      },
      (err) => {
        this.dismissLoading()
        console.log('error',err)
      }
      );

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

    let fecha:any=this.route.snapshot.paramMap.get("fecha")
    if(fecha!=null && fecha!=undefined && fecha!=""){
      console.log("byUrl")
      this.router.navigateByUrl(`/tomar-foto;idTarea=${this.idTareaEvent}`,{replaceUrl:true})
    }else{
      this.modalController.dismiss();
      this.router.navigate(['/tomar-foto',  { idTarea: this.idTareaEvent }])
    }
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
    let fecha:any=this.route.snapshot.paramMap.get("fecha")
    if(fecha!=undefined && fecha!=""){
      let params=`;idTarea=${this.idTarea};machine=${this.idMaquina};fecha=${this.route.snapshot.paramMap.get("fecha")}`
      this.router.navigateByUrl(`/reporte-diario${params}`, { replaceUrl: true});
    }else{
      this.modalController.dismiss();
    }
    
    return true;
  }
}
