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
      idMaquina: '637d169d21c773c9052c9406',
      idUser: '6377fb874bf53e9bb88d55dd',
      idTarea: '637d1c9321c773c9052c9416'
    }
  });

  (await modal).present();
 }
}
