import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  usuario = {
    user: '',
    pass: ''
  }

  errorMsg = '';

  constructor(public fb: FormBuilder, 
              private menu: MenuController,
              private route: Router,
              private loginService: LoginService) {
    this.formularioLogin = this.fb.group({
      nombre: ['', Validators.required],
      password: ['',Validators.required]
    });

    this.menu.enable(false);
  }

  ngOnInit() {
  }

  iniciarSesion(){
    //console.log(this.usuario);
    this.loginService.validateLogin(this.usuario.user, this.usuario.pass).subscribe(
      (data:any)=>{
        console.log('rpta', data.usuario);
        if(data.ok){
          console.log('paso');
          this.route.navigate(['./inicio']);
        }else{
          this.errorMsg = data.msg;
        }
      }
    );
    
    //const data = await this.userService.login(this.usuario.user, this.usuario.pass);
    //this.route.navigate(['./inicio']);
  }
}
