import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';
import { UserModel } from 'src/app/models/user';
import { StorageService } from 'src/app/services/storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as storeActions from '../../store/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  usuario: UserModel = new UserModel;
  // usuario = {
  //   user: '',
  //   pass: ''
  // }

  errorMsg = '';
  private _storage: Storage | null = null;

  constructor(public fb: FormBuilder, 
              private menu: MenuController,
              private route: Router,
              private loginService: LoginService,
              private storageService: StorageService,
              private store: Store<AppState>) {
    this.formularioLogin = this.fb.group({
      nombre: ['', Validators.required],
      password: ['',Validators.required]
    });

    this.menu.enable(false);
  }

  ngOnInit() {
  }

  async iniciarSesion(){
    //console.log(this.usuario);
    if(this.usuario.password === ''){
      this.errorMsg = 'Debe colocar una contraseña';
      return;
    }

    if(this.usuario.usuario === ''){
      this.errorMsg = 'Debe colocar un usuario';
      return;
    }    

    this.store.dispatch(storeActions.validateLogin({user:this.usuario.usuario,pass: this.usuario.password}))

    this.loginService.validateLogin(this.usuario.usuario, this.usuario.password).subscribe(
      async (data:any) => {
        
        if(data.ok){
          this.usuario = data.usuario;
          await this.storageService.saveRemoveUsuario(this.usuario);
          this.route.navigateByUrl('/inicio');
        }else{
          this.errorMsg = data.msg;
        }
      }
    );
    
    //const data = await this.userService.login(this.usuario.user, this.usuario.pass);
    //this.route.navigate(['./inicio']);
  }
}
