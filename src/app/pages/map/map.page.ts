import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  coor: {} = {}
  arrCoor: any[] = []
  // markers: Marker[] = [];
  @Input() idTarea;
  
  constructor(private taskService: TaskService,
              private _route: ActivatedRoute) { }

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
    // let idTarea = this._route.snapshot.paramMap.get("idTarea");

    // if(!idTarea){
    //   idTarea = ''
    // }
    this.idTarea = '637d1c9321c773c9052c9416';
    await this.taskService.getTaskEvent(this.idTarea).subscribe((data: any) => {
      console.log(data);
      if(data.ok){
                
        const { taskEvent } = data;
  
        for(let i = 0; i < taskEvent.length; i++){
          const lati: number = taskEvent[i].latitude;
          const long: number = taskEvent[i].longitude;

          // console.log(lati)
          // console.log(long)
          this.coor = { lat: lati, lng: long };
          console.log(this.coor)
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
      }
    });

    // this.markers.forEach(marker => {
    //   this.addMarker(marker);
    // });
  }

  // addMarker(marker: Marker) {
  //   return new google.maps.Marker({
  //     position: marker.position,
  //     map: this.map,
  //     title: marker.title
  //   });
  // }

  ngOnInit() {
    this.loadMap();
  }

  ngAfterViewChecked(): void {
    // this.loadMap();
  }

}
