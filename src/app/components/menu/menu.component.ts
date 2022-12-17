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

    try {
      this.optionService.getOption().subscribe((data: any) => {
        console.log('menu',data)
        
        if( data.ok ){
          this.appPages = data.option;
        }
      });      
    } catch (error) {
      this.appPages = [
        { title: 'Inicio', url: '/inicio', icon: 'home' },
        { title: 'Asignación tareas', url: '/asigna-tarea', icon: 'calendar' },
        { title: 'Configuración', url: '/configuracion', icon: 'settings' },
        { title: 'Reporte', url: '/reporte-diario', icon: 'calendar-number-outline' },
        { title: 'Toma Tiempo', url: '/toma-tiempo', icon: 'alarm' },


        { title: 'Cerrar Sesion', url: '/login', icon: 'power' },
      ];
    }
    
  }
}
