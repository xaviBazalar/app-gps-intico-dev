import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { TaskService } from 'src/app/services/task.service';
import { MaquinariaModel } from '../../models/maquinaria'
import { UserModel } from '../../models/user'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  item: any[] = []; 
  nombreUsuarioMenu:string=""

  // get users(): UserModel[]{
  //   return this.storageService.getUser;
  // }

  constructor(private menuController: MenuController,
              private storageService: StorageService,
              private taskService: TaskService,
              public loadingController: LoadingController
            ) {
    this.menuController.enable(true);
    
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

  async ngOnInit(): Promise<void> {
    const [user] = await Promise.all([this.storageService.loadUser()]);
    this.nombreUsuarioMenu=user[0].nombre
  }

  async ngAfterViewInit(): Promise<void> {
    let idUser: String = '';
    // var userL=this.storageService.loadUser()


    //let userData=this.storageService.loadUser();
    const [user] = await Promise.all([this.storageService.loadUser()]);
    console.log(user)
    const dataUser = user;
    // console.log('localuser' ,dataUser);
    if(dataUser){
      idUser = dataUser[0].uid;
      //this.ShowLoading()
      this.taskService.getTask(idUser, null, null).subscribe((data:any) => {
        // console.log('idUser', idUser);
        const { task } = data;
        // console.log('tarea', task);
        for (let index = 0; index < task.length; index++) {
          // console.log('task', task[index]);
          const { planificacionTrabajo, tareaMaquinaria, turno, uid='', machine, user } = task[index];
          //const _item = {nombre: machine.descripcion + "--" + planificacionTrabajo + '--' + tareaMaquinaria, 
          const _item = {nombre: machine.descripcion +'-' + tareaMaquinaria, 
          redirect: `/maquina-tarea/${ machine._id }/${ idUser }/${ uid }/${ machine.idInterno }`};
          // console.log(_item );
          this.item.push( _item );        
        }
        //this.dismissLoading()
      });
    }
  }

  toogleMenu(){
    this.menuController.toggle();
  }
}
