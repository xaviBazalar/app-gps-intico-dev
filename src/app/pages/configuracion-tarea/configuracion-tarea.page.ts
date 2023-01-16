import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
//import { TaskService } from 'src/app/services/task.service';
import { MaquinaTareaPage } from '../maquina-tarea/maquina-tarea.page';
//import { StorageService } from 'src/app/services/storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { addTareas, addTareasNew } from '../../store/tareas/tareas.actions';
import { TaskModel } from 'src/app/models/task';
import { PlanificacionTrabajoService } from 'src/app/services/planificacion-trabajo.service';
import { PlanificacionTrabajoModel } from 'src/app/models/planificacionTrabajo';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { ContractService } from 'src/app/services/contract.service';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
@Component({
  selector: 'app-configuracion-tarea',
  templateUrl: './configuracion-tarea.page.html',
  styleUrls: ['./configuracion-tarea.page.scss'],
})


export class ConfiguracionTareaPage implements OnInit {
  planTrabajo: any = [];
  machine: any = [];
  contrats: any = [];
  idUser: String = '';
  dataUser: any;

  constructor(private menu: MenuController,
              private alertController: AlertController,
              private planificacionService: PlanificacionTrabajoService,
              private maquinaService: MaquinariaService,
              private contratoService: ContractService,
              private store: Store<AppState>,
              private router: Router,
              private taskService:TaskService
              ) {
    this.menu.enable(true);
  }

  ngOnInit() {
    this.store.select("login").subscribe((data: any) => {
        this.dataUser = data.dataLogin[0]
    })
  }

  async ngAfterViewInit(): Promise<void> {
    if(this.dataUser){
      console.log('Usuario',this.dataUser);
      this.idUser = this.dataUser.uid;
      
      this.planificacionService.getPlanificacionTrabajo().subscribe((data: any) => {
        if(data.ok){
          console.log('planificacion',data.PlanificacionTrabajo);
          const { docs: PlanificacionTrabajo } = data.PlanificacionTrabajo
          this.planTrabajo = PlanificacionTrabajo;
        }
      });

      this.maquinaService.getMachine(this.idUser).subscribe((data: any) => {
        console.log('maquina', data)
        if(data.ok){
          const { usermachine } = data;
          for(let i=0; i<usermachine.length; i++){
            const {machine} = usermachine[i]
            this.machine.push(machine)
          }
        }
      });

      this.contratoService.getContratos().subscribe((data: any) => {
        if(data.ok){
          const { contract } = data;
          this.contrats = contract;
        }
      })
    }
  }

  removeDuplicates(arrayIn) {
    var arrayOut:any = [];
    arrayIn.forEach(item=> {
      try {
        if (JSON.stringify(arrayOut[arrayOut.length-1]._id) !== JSON.stringify(item._id)) {
          arrayOut.push(item);
        }
      } catch(err) {
        arrayOut.push(item);
       }
    })
    return arrayOut;
}

 async abrirMaquinaTrabajo() {
    const dtime1: any = document.getElementById('datetime1');
    const fechaDesde = new Date(dtime1.value);

    const dtime2: any = document.getElementById('datetime2');
    const fechaHasta = new Date(dtime2.value);

    const planificacionInput: any = document.getElementById('cmbPlanificacionTrabajo');
    const planificacion = planificacionInput.value;

    const txtTareaMaquinaria: any = document.getElementById('txtTareaMaquinaria');
    const tareaMaquinaria = txtTareaMaquinaria.value;

    const txtHoras: any = document.getElementById('txtHoras');
    const horas = txtHoras.value;

    const cmbMaquina: any = document.getElementById('cmbMaquina');
    const maquina = cmbMaquina.value;

    const cmbTurno: any = document.getElementById('cmbTurno');
    const turno = cmbTurno.value;  

    const cmbContrato: any = document.getElementById('cmbContrato');
    const contrato = cmbContrato.value;  

    try {
      const hh = Number.parseInt(horas)
      if(hh < 1 || hh > 24 ){
        await this.alertMessage('El tiempo debe estar entre 1 a 24');
        return;
      }
    } catch (error) {
      await this.alertMessage('El tiempo debe ser de tipo numerico y estar entre 1 a 24');
      return;
    }

    const fechaAux: Date = new Date();
    fechaAux.setHours(0);
    fechaAux.setMinutes(0);
    fechaAux.setSeconds(0);
    fechaAux.setMilliseconds(0);

    let task: TaskModel = new TaskModel;
    if(dtime1.value){
      task.fechaTareaDesde = fechaDesde;
    }else{
      task.fechaTareaDesde = fechaAux;    
    }

    if(dtime2.value){
      task.fechaTareaHasta = fechaHasta;
    }else{
      task.fechaTareaHasta = fechaAux;    
    }
    
    task.tareaMaquinaria = tareaMaquinaria;
  // task.planificacionTrabajo=planificacion
    task.machine = maquina;

    let dataPlanificacion=this.planTrabajo.filter((data:any)=>{
        return data.descripcion==planificacion
    })

    const tiempo: String = horas.toString();
    const tiempoSLA = tiempo.padStart(2, '0') + '00 Hrs';

    task.division = dataPlanificacion[0].division._id
    task.gerencia = dataPlanificacion[0].division.idGerencia
    task.planificacionTrabajo = dataPlanificacion[0].uid
    task.turno = turno;
    task.tiempoSLA = tiempoSLA;
    task.contrato = contrato;
    task.user = this.idUser;

    // console.log(dataPlanificacion)
    console.log(task)
    
    //this.store.dispatch(addTareasNew({data: task}));
    this.taskService.postTask(task).subscribe( (data: any) => {
      if(data.ok){
        this.alertMessage('Se registró con éxito');
         this.router.navigateByUrl('/inicio',{ replaceUrl:true})
      }else{
        if(!data.ok){
            this.alertMessage(data.msg);
        }
      }
    })
    
    /*this.store.select("tareas").subscribe( (data: any) => {
      console.log('respuesta', data)
      if(data.rptaTarea.ok & data.loading){
         this.alertMessage('Se registró con éxito');
          this.router.navigateByUrl('/inicio',{ replaceUrl:true})
      }else{
        if(!data.rptaTarea.ok){
           this.alertMessage(data.rptaTarea.msg);
        }
      }
    })*/

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

