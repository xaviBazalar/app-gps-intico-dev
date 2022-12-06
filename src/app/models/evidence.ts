export class EvidenceModel {
    fechaRegistro: Date | null;
    user: String;
    task: String;
    urlImg: String

    constructor(){
        this.task = '';
        this.fechaRegistro = null;
        this.urlImg = '';
        this.user = '';
    }
}