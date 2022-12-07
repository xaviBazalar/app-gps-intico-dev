export class TaskEventsModel {
    latitude: Number;
    longitude: Number;
    fechaRegistro: Date | null;
    nivel: Number;
    tipo: String;
    subTipo: String;
    machine: string;
    task: String;
    user: String;
    timpo: Number;
    horaInicio: String | null;
    horaFin: String | null;
    tipoEstilo: String | null;

    constructor(){
        this.latitude = 0;
        this.longitude = 0;
        this.fechaRegistro = null;
        this.nivel = 0;
        this.tipo = '';
        this.subTipo = '';
        this.machine = '';
        this.task = '';
        this.user = '';
        this.timpo = 0;
        this.horaInicio = '';
        this.horaFin = '',
        this.tipoEstilo = '';
    }
}