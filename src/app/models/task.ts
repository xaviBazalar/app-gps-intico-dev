export class TaskModel {
    planificacionTrabajo: String;
    tareaMaquinaria: String;
    machine: string;    
    fechaTarea: Date | null;
    turno: String;
    user: String;


    constructor(){
        this.planificacionTrabajo = '';
        this.tareaMaquinaria = '';
        this.machine = ''
        this.fechaTarea = null;
        this.turno = '';
        this.user = '';
    }
}