export class UserModel {
    usuario: String;
    email: String;
    password: string;
    nombre: String;
    profile: String;
    uid: String;

    constructor(){
        this.usuario = '';
        this.email = '';
        this.password = '';
        this.nombre = '';
        this.profile = '';
        this.uid = '';
    }
}