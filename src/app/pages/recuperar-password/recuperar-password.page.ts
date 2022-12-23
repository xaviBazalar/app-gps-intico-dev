import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage implements OnInit {
  flagCodigo: Boolean = false;
  formRecuperacion: FormGroup;

  email: String = '';
  codigo: String = '';
  pass1: String = '';
  pass2: String = '';

  constructor(public formBuilder: FormBuilder,
              private loginService: LoginService,
              private alertController: AlertController) {
    this.formRecuperacion = this.formBuilder.group({
      email: ['', Validators.required],
      codigo: ['', Validators.required],
      passNew: ['', Validators.required],
      passNewCopy: ['',Validators.required]
    });
  }

  ngOnInit() {
  }

  actualizarPass(){
    if(this.pass1 !== this.pass2){
      this.alertMessage('Las contraseñas ingresadas no coinciden')
      return;
    }

    let idRecovery: String;
    let idUser: String;

    this.loginService.validacionCodigo(this.codigo, this.email).subscribe((data: any) => {
      if(data.ok){
        const { recovery_usuario } = data;

        console.log(recovery_usuario);
        
        idRecovery = recovery_usuario[0].uid;
        idUser = recovery_usuario[0].idUser;

        if(!recovery_usuario[0].activo){
          this.alertMessage('El codigo de validación ya fue usado');
          this.flagCodigo = false;
          return;
        }

        const recovery = {
          id: idRecovery,
          password: this.pass1
        }

        console.log(recovery)

        this.loginService.actualizarPassword(recovery).subscribe((data: any) => {
          console.log(data);
        })

      }
    });
  }

  enviarCodigo(){
    console.log(this.email);
    this.loginService.enviarCodigo(this.email).subscribe((data: any) => {
      if(data.total > 0){
        this.flagCodigo = true;
      }else {
        this.flagCodigo = false;
      }
    })
  }

  async alertMessage(mensaje: string) {
    const head = mensaje

    const alert = await this.alertController.create({
      header: head,
      cssClass: 'custom-alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          cssClass: 'alert-button-confirm',
          role: '1',
        },
      ],
    });

    await alert.present();

    return true;
  }

}
