import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
//import { TaskService } from 'src/app/services/task.service';
import { MaquinaTareaPage } from '../maquina-tarea/maquina-tarea.page';
//import { TaskModel } from '../../models/task'
//import { UserModel } from '../../models/user'
//import { StorageService } from 'src/app/services/storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { addTareas } from '../../store/tareas/tareas.actions';

@Component({
  selector: 'app-asigna-tarea',
  templateUrl: './asigna-tarea.page.html',
  styleUrls: ['./asigna-tarea.page.scss'],
})
export class AsignaTareaPage implements OnInit {

  // taskModel: TaskModel = new TaskModel;
  // userModel:UserModel = new UserModel;

  planTrabajo: any = [];
  tareaMachine: any = [];
  turnoArray: any = [];
  machine: any = [];
  idMaquina: any = [];
  idTask: String = '';
  idUser: String = '';
  idInterno: any = { idInter: '', idGene: '' };
  dataUser: any

  constructor(private menu: MenuController,
              private modalCtrl: ModalController,
              //private taskService: TaskService,
              //private storageService: StorageService,
              private store: Store<AppState>
              ) {
    this.menu.enable(true);

  }

  ngOnInit() {
    this.store.select("login").subscribe((data: any) => {
      this.dataUser = data.dataLogin[0]
    })
  }

  async ngAfterViewInit(): Promise<void> {
    //let userData = this.storageService.loadUser();
    //const [user] = await Promise.all([userData])


    //const dataUser = user;

    if(this.dataUser!=""){
      this.idUser = this.dataUser.uid;
      this.store.dispatch(addTareas({ id: this.idUser }))
      //this.taskService.getTask(this.idUser, null, null).subscribe((data:any) => {
      this.store.select("tareas").subscribe((data: any) => {
        const { tareas } = data;
        this.planTrabajo=[]
        this.tareaMachine=[]
        this.turnoArray=[]
        this.machine=[]
        for (let index = 0; index < tareas.length; index++) {
          const { planificacionTrabajo, tareaMaquinaria, turno, uid, machine, user } = tareas[index];
          this.planTrabajo.push(planificacionTrabajo);
          this.tareaMachine.push(tareaMaquinaria);
          this.turnoArray.push(turno);
          this.machine.push({des: machine.descripcion, id: {idInter: machine.idInterno, idGene: machine._id}});
          this.idTask = uid;
          this.idUser = user;
        }

        this.planTrabajo=this.removeDuplicates(this.planTrabajo)
        this.machine=this.removeDuplicates(this.machine)
      });
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
  const modal = this.modalCtrl.create({
    component: MaquinaTareaPage,
    componentProps: {
      idMaquina: this.idInterno.idGene,//'637d169d21c773c9052c9406',
      idUser: this.idUser,//'6377fb874bf53e9bb88d55dd',
      idTarea: this.idTask,//'637d1c9321c773c9052c9416',
      idMaquinaInterna: this.idInterno.idInter
    }
  });

  (await modal).present();
 }
}
