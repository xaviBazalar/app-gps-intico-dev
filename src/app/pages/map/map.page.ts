import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaquinariaService } from 'src/app/services/maquinaria.service';
import { TaskService } from 'src/app/services/task.service';

declare var google;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map = null;
  coor: {} = {};
  arrCoor: any[] = [];
  idTarea: String = '';
  // markers: Marker[] = [];
  // idTarea: any;
  
  constructor(private taskService: MaquinariaService,
              private eventService: TaskService,
              private _route: ActivatedRoute) {
    // this.idTarea = this._route.snapshot.paramMap.get("idTarea");
    // console.log('tarea', this.idTarea)
               }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapE = document.getElementById('map');
    const mapEle: HTMLElement = mapE as HTMLElement;

    // create LatLng object
    const myLatLng = {lat: -22.617158, lng: -69.862215};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.renderMarkers();
    });
  }

  async renderMarkers() {
    console.log('buscando ubicaciones')
    let idTarea: string | null = this._route.snapshot.paramMap.get("idTarea");

    if(idTarea)
      this.idTarea = idTarea;

    console.log('tareaa', idTarea);

    (await this.eventService.getTaskEventMap(this.idTarea)).subscribe(async (data: any) =>{
      console.log('task', data)

      if(data.ok){
        const { taskEvent } = data;
        
        const { machine } = taskEvent[0]
        const fecha: Date = new Date(taskEvent[0].fechaRegistro);
        const horaIni = taskEvent[0].horaInicio;
        const horaFin = taskEvent[0].horaFin;

        const horIni = horaIni.split(':')
        const hhIni = Number.parseInt(horIni[0])
        const mmIni = Number.parseInt(horIni[1])

        const horFin = horaFin.split(':')
        const hhFin = Number.parseInt(horFin[0])
        const mmFin = Number.parseInt(horFin[1])

        console.log("fecha",fecha)
        let fechaInicio = fecha;
        fechaInicio.setHours(hhIni);
        fechaInicio.setMinutes(mmIni);
        fechaInicio.setSeconds(0);
        fechaInicio.setMilliseconds(0);

        const fechaDesdeTS = (fechaInicio).getTime() / 1000;

        let fechaFin = fecha;
        fechaFin.setHours(hhFin);
        fechaFin.setMinutes(mmFin);
        fechaFin.setSeconds(0);
        fechaFin.setMilliseconds(0);

        const fechaHastaTS = (fechaFin).getTime() / 1000;
        
        console.log('fechaDesdeTS',fechaDesdeTS)
        console.log('fechaHastaTS',fechaHastaTS);

        (await this.taskService.obtenerUbicaTiempo(machine.idInterno, fechaDesdeTS.toString(), fechaHastaTS.toString())).subscribe((data: any) => {
          console.log('flespi',data)
          const { result } = data
      
          for(let i = 0; i < result.length; i++){

            const {'position.latitude': _latitude, 'position.longitude': _longitude} = result[i]
            
            const lati: number = _latitude;
            const long: number = _longitude;
  
            // console.log(lati)
            // console.log(long)
            this.coor = { lat: lati, lng: long };
            // console.log(this.coor)
            this.arrCoor.push(this.coor);
          }
  
          const flightPath = new google.maps.Polyline({
            path: this.arrCoor,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
        
          flightPath.setMap(this.map);
        })
      }
    })

    // await this.taskService.obtenerHistorial(idTarea).subscribe((data: any) => {
    //   console.log(data);
      
    // });

  }


  ngOnInit() {
    this.loadMap();
  }

  ngAfterViewChecked(): void {
    // this.loadMap();
  }

}
