import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

interface Maquinaria {
  nombre: string;
  id: string;
  redirect: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  maquinaria: Maquinaria[] = [
    {
      nombre: 'komatzu',
      id: '123',
      redirect: '/maquina-tarea/123'
    },
    {
      nombre: 'Caterpilar',
      id: '456',
      redirect: '/maquina-tarea/456'
    }
  ];

  constructor(private menuController: MenuController) {
    this.menuController.enable(true);
   }

  ngOnInit() {
  }

  toogleMenu(){
    this.menuController.toggle();
  }
}
