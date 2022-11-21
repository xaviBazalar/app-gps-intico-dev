import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { TomarFotoPage } from '../tomar-foto/tomar-foto.page';
import { TomaTiempoPage } from '../toma-tiempo/toma-tiempo.page';
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';
// import { PositionError } from '@awesome-cordova-plugins/geolocation';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-maquina-tarea',
  templateUrl: './maquina-tarea.page.html',
  styleUrls: ['./maquina-tarea.page.scss'],
})
export class MaquinaTareaPage implements OnInit {
  post = {
    mensaje: '',
    coords: '',
    posicion: false
  };

  cargandoGeo = false;

  timeOperativo: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timerOperativo: number = 0;
  intervalOperativo;
  stateOperativo: 'start' | 'stop' = 'stop';

  timePausa: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timerPausa: number = 0;
  intervalPausa;
  statePausa: 'start' | 'stop' = 'stop';

  timeDetencion: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timerDetencion: number = 0;
  intervalDetencion;
  stateDetencion: 'start' | 'stop' = 'stop';

  constructor(private modalController: ModalController,
              private menuController: MenuController,
              private modalCtrl: ModalController,
              private geoLocation: Geolocation) {
    //this.menuController.enable(false);
    this.getGep();
  }

  ngOnInit() {
  }

  async finalizar(){
    this.modalController.dismiss();
    return true;
  }

  async abrirTomarFoto() {
    const modal = this.modalCtrl.create({
      component: TomarFotoPage,
      componentProps: {
        idTarea: '123456'
      }
    });
    (await modal).present();
  }

  async abrirTomarTiempo() {
    const modal = this.modalCtrl.create({
      component: TomaTiempoPage,
      componentProps: {
        idTarea: '123456'
      }
    });
    (await modal).present();
  }

  getGep(){
    if(!this.post.posicion){
      this.post.coords = '';
      return;
    }

    this.cargandoGeo = true;

    this.geoLocation.getCurrentPosition().then((resp) => {
      this.cargandoGeo = false;
      const coords = `${ resp.coords.latitude },${ resp.coords.longitude }`;
      this.post.coords = coords;
      console.log(coords);
     }).catch((error) => {
       console.log('Error getting location', error);
       this.cargandoGeo = false;
     });

    // const watch = this.geoLocation.watchPosition();
    // watch.subscribe((position) => {
    //   if ((position as Geoposition).coords !== undefined) {
    //     const geoposition = (position as Geoposition);
    //     // console.log('Latitude: ' + geoposition.coords.latitude + ' - Longitude: ' + geoposition.coords.longitude);
    //     const coords = `${ geoposition.coords.latitude },${ geoposition.coords.longitude }`;
    //     this.post.coords = coords;
    //   } else {
    //     const positionError = (position as PositionError);
    //     console.log('Error ' + positionError.code + ': ' + positionError.message);
    //   }
    // });
  }

  iniciarOperativo(tipoBoton: number){
    this.stateOperativo = 'start';
    clearInterval(this.intervalOperativo);
    this.timerOperativo = 0;
    this.intervalOperativo = setInterval(() => {
      this.updateTimerOperativo(tipoBoton);
    },1000);
  }

  stopTimerOperativo(){
    clearInterval(this.intervalOperativo);
    // this.timeOperativo.next('00:00');
    this.stateOperativo = 'stop';
  }

  updateTimerOperativo(tipoBoton: number){
    this.timerOperativo++;
    let minutes: any = this.timerOperativo / 60;
    let seconds: any = this.timerOperativo % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timeOperativo.next(text);
  }

  iniciarPausa(tipoBoton: number){
    this.statePausa = 'start';
    clearInterval(this.intervalPausa);
    this.timerPausa = 0;
    this.intervalPausa = setInterval(() => {
      this.updateTimerPausa(tipoBoton);
    },1000);
  }

  stopTimerPausa(){
    clearInterval(this.intervalPausa);
    // this.timePausa.next('00:00');
    this.statePausa = 'stop';
  }

  updateTimerPausa(tipoBoton: number){
    this.timerPausa++;
    let minutes: any = this.timerPausa / 60;
    let seconds: any = this.timerPausa % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timePausa.next(text);
  }

  iniciarDetencion(tipoBoton: number){
    this.stateDetencion = 'start';
    clearInterval(this.intervalDetencion);
    this.timerDetencion = 0;
    this.intervalDetencion = setInterval(() => {
      this.updateTimerDetencion(tipoBoton);
    },1000);
  }

  stopTimerDetencion(){
    clearInterval(this.intervalDetencion);
    // this.timeDetencion.next('00:00');
    this.stateDetencion = 'stop';
  }

  updateTimerDetencion(tipoBoton: number){
    this.timerDetencion++;
    let minutes: any = this.timerDetencion / 60;
    let seconds: any = this.timerDetencion % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timeDetencion.next(text);
  }
}
