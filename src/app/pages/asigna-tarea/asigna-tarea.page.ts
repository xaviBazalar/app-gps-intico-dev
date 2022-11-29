import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { MaquinaTareaPage } from '../maquina-tarea/maquina-tarea.page';
import { TaskModel } from '../../models/task'
import { UserModel } from '../../models/user'
import { StorageService } from 'src/app/services/storage.service';

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
  turnoArray: any=[];
  machine = [{
    id: { idInter: '', idGene: ''},
    des: ''
  }];
  idMaquina: any = [];
  idTask: String = '';
  idUser: String = '';
  idInterno: any = { idInter: '', idGene: '' };

  constructor(private menu: MenuController,
              private modalCtrl: ModalController,
              private taskService: TaskService,
              private storageService: StorageService
              ) {
    this.menu.enable(true);

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //this.idUser = '6380de2a43a95b03d1418337';
    this.storageService.getUsuario().then((usuario: UserModel) => {
      // console.log('storage', usuario);
      this.idUser = usuario.uid;
      console.log(this.idUser);
    })


    this.taskService.getTask(this.idUser, null, null).subscribe((data:any) => {
      console.log(data);
      const { task } = data;
      console.log('tarea', task);
      for (let index = 0; index < task.length; index++) {
        console.log(task[index]);
        const { planificacionTrabajo, tareaMaquinaria, turno, uid, machine, user } = task[index];
        console.log(tareaMaquinaria)
        this.planTrabajo.push(planificacionTrabajo);
        this.tareaMachine.push(tareaMaquinaria);
        this.turnoArray.push(turno);
        this.machine.push({des: machine.descripcion, id: {idInter: machine.idInterno, idGene: machine._id}});
        this.idTask = uid;
        this.idUser = user;
      }

      console.log(this.planTrabajo);
    });
  }

 async abrirMaquinaTrabajo() {
  // console.log('idmaquina',this.idInterno.idInter);
  // console.log('maquina',this.idInterno.idGene );
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
