import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-toma-tiempo',
  templateUrl: './toma-tiempo.page.html',
  styleUrls: ['./toma-tiempo.page.scss'],
})
export class TomaTiempoPage implements OnInit {
  myDate: any;

  constructor(private modalController: ModalController) {
    this.myDate = new Date().toString();
    console.log(this.myDate);
   }

  ngOnInit() {
  }

  aceptar(){
    this.modalController.dismiss();
    return true;
  }

}
