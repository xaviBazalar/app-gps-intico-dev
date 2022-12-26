import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
//import { StorageService } from 'src/app/services/storage.service';
//import { TaskService } from 'src/app/services/task.service';
//import { MaquinariaModel } from '../../models/maquinaria'
//import { UserModel } from '../../models/user'
import { LoadingController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { addTareas } from '../../store/tareas/tareas.actions';
//import { Resolve } from '@angular/router';
import { Observable, map, tap, take, pipe, filter, first } from 'rxjs';
//import { selectVisibleLogin } from '../../store/reducers/login.reducers';
//import { getLogin } from '../../store/actions/login.actions';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  item: any[] = [];
  nombreUsuarioMenu: string = ""
  dataUser: any

  // get users(): UserModel[]{
  //   return this.storageService.getUser;
  // }

  constructor(private menuController: MenuController,
    //private storageService: StorageService,
    //private taskService: TaskService,
    public loadingController: LoadingController,
    private store: Store<AppState>
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

  ngOnInit() {
    this.store.select("login").subscribe((data: any) => {
      this.dataUser = data.dataLogin[0]
    })
  }

  getCurrentValue(): Observable<number> {
    return this.store.select(appState => appState.login.dataLogin)
      .pipe(filter(Boolean))
  }

  async ngAfterViewInit(): Promise<void> {
    let idUser: String = '';
    //const [user] = await Promise.all([this.storageService.loadUser()]);
    //const dataUser = user;
    if (this.dataUser != "") {
      idUser = this.dataUser.uid;
      this.store.dispatch(addTareas({ id: idUser }))
      this.store.select("tareas").subscribe((data: any) => {
        this.item=[]
        const { tareas } = data;
        for (let index = 0; index < tareas.length; index++) {
          const { planificacionTrabajo, tareaMaquinaria, turno, uid = '', machine, user } = tareas[index];
          const _item = {
            nombre: planificacionTrabajo.descripcion + '-' + machine.descripcion + '-' + tareaMaquinaria,
            redirect: `/maquina-tarea/${machine._id}/${idUser}/${uid}/${machine.idInterno}`
          };
          this.item.push(_item);
        }
      })
      //this.ShowLoading()

    }
  }

  toogleMenu() {
    this.menuController.toggle();
  }
}
