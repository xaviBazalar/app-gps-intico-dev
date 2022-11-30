export class MaquinariaModel {
    mensaje: string;
    coords: string;
    posicion: boolean;
    encendido: String;
    velocidad: Number;
    movimiento: String;
    nombre: String;
    latitude: Number;
    longitude: Number;
    url: String;

    constructor() {
        this.mensaje = '';
        this.coords = '';
        this.posicion = false;
        this.encendido = '';
        this.velocidad = 0;
        this.movimiento = '';
        this.nombre = '';
        this.latitude = 0;
        this.longitude = 0;
        this.url = '';
    }
}