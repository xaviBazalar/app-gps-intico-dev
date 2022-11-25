import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { MaquinaTareaPage } from '../maquina-tarea/maquina-tarea.page';
import { TaskModel } from '../../models/task'

@Component({
  selector: 'app-asigna-tarea',
  templateUrl: './asigna-tarea.page.html',
  styleUrls: ['./asigna-tarea.page.scss'],
})
export class AsignaTareaPage implements OnInit {

  // taskModel: TaskModel = new TaskModel;
  planTrabajo: any = [];
  tareaMachine: any = [];
  turnoArray: any=[];  
  machine: any = [];
  idTask: String = '';
  idUser: String = '';

  constructor(private menu: MenuController, 
              private modalCtrl: ModalController,
              private taskService: TaskService
              ) {
    this.menu.enable(true);
    
    this.idUser = '6380de2a43a95b03d1418337';

    this.taskService.getTask(this.idUser, null, null).subscribe((data:any) => {
      const { task } = data;
      console.log(task);
      for (let index = 0; index < task.length; index++) {
        console.log(task[index]);
        const { planificacionTrabajo, tareaMaquinaria, turno, uid, machine } = task[index];
        console.log(tareaMaquinaria)
        this.planTrabajo.push(planificacionTrabajo);
        this.tareaMachine.push(tareaMaquinaria);
        this.turnoArray.push(turno);
        this.machine.push(machine.descripcion);
        this.idTask = uid;
      }

      console.log(this.planTrabajo);
    });
  }

  ngOnInit() {
  }

 async abrirMaquinaTrabajo() {
  const modal = this.modalCtrl.create({
    component: MaquinaTareaPage,
    componentProps: {
      idMaquina: '637d169d21c773c9052c9406',
      idUser: '6377fb874bf53e9bb88d55dd',
      idTarea: '637d1c9321c773c9052c9416'
    }
  });

  (await modal).present();
 }
}
