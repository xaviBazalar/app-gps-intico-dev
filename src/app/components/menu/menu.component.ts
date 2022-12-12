import { Component, OnInit } from '@angular/core';
import { OptionService }  from '../../services/option.service';
import { OptionModel } from '../../models/option';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  appPages: any[] = [];
  constructor(private optionService: OptionService){
  }
  ngOnInit(): void {
    this.optionService.getOption().subscribe((data: any) => {
      console.log('menu',data)
      this.appPages = data.option;
    })
  }

  // public appPages = [
  //   { title: 'Inicio', url: '/inicio', icon: 'home' },
  //   { title: 'Asignación tareas', url: '/asigna-tarea', icon: 'calendar' },
  //   // { title: 'Asignación tareas', url: '/maquina-tarea', icon: 'calendar' },
  //   { title: 'Configuración', url: '/configuracion', icon: 'settings' },
  //   { title: 'Cerrar Sesion', url: '/login', icon: 'power' },
  // ];

}
