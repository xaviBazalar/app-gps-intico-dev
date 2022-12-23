import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { MaquinaTareaPage } from '../maquina-tarea/maquina-tarea.page';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-configuracion-tarea',
  templateUrl: './configuracion-tarea.page.html',
  styleUrls: ['./configuracion-tarea.page.scss'],
})


export class ConfiguracionTareaPage implements OnInit {

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

  constructor(private menu: MenuController,
              private modalCtrl: ModalController,
              private taskService: TaskService,
              private storageService: StorageService
              ) {
    this.menu.enable(true);

  }

  ngOnInit() {
  }

  async ngAfterViewInit(): Promise<void> {
    let userData = this.storageService.loadUser();
    const [user] = await Promise.all([userData])


    const dataUser = user;

    if(dataUser){
      this.idUser = dataUser[0].uid;

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

