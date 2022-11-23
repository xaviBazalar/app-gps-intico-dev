import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';

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

  constructor(public fb: FormBuilder, 
              private menu: MenuController,
              private route: Router,
              private userService: UsuarioService) {
    this.formularioLogin = this.fb.group({
      nombre: ['', Validators.required],
      password: ['',Validators.required]
    });

    this.menu.enable(false);
  }

  ngOnInit() {
  }

  async iniciarSesion(){
    console.log(this.usuario);
    const data = await this.userService.login(this.usuario.user, this.usuario.pass);
    console.log('cs', data);
    this.route.navigate(['./inicio']);
  }
}
