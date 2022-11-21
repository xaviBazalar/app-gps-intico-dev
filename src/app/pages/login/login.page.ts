import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  constructor(public fb: FormBuilder, private menu: MenuController) {
    this.formularioLogin = this.fb.group({
      nombre: ['', Validators.required],
      password: ['',Validators.required]
    });

    this.menu.enable(false);
  }

  ngOnInit() {
  }

}
