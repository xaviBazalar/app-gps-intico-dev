import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Asignación tareas', url: '/asigna-tarea', icon: 'calendar' },
    // { title: 'Asignación tareas', url: '/maquina-tarea', icon: 'calendar' },
    { title: 'Configuración', url: '/configuracion', icon: 'settings' },
    { title: 'Cerrar Sesion', url: '/login', icon: 'power' },
  ];

}
