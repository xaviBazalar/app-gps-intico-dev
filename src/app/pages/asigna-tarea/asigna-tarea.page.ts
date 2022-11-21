import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { MaquinaTareaPage } from '../maquina-tarea/maquina-tarea.page';

@Component({
  selector: 'app-asigna-tarea',
  templateUrl: './asigna-tarea.page.html',
  styleUrls: ['./asigna-tarea.page.scss'],
})
export class AsignaTareaPage implements OnInit {

  constructor(private menu: MenuController, private modalCtrl: ModalController) {
    this.menu.enable(true);
  }

  ngOnInit() {
  }

 async abrirMaquinaTrabajo() {
  const modal = this.modalCtrl.create({
    component: MaquinaTareaPage,
    componentProps: {
      idMaquina: '123456'
    }
  });

  (await modal).present();
 }
}
