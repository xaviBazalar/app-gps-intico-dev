import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage implements OnInit {
  codigoHash: String = '';
  formRecuperacion: FormGroup;
  constructor(public formBuilder: FormBuilder) {
    this.formRecuperacion = this.formBuilder.group({
      email: ['', Validators.required],
      codigo: ['', Validators.required],
      passNew: ['', Validators.required],
      passNewCopy: ['',Validators.required]
    });
  }

  ngOnInit() {
  }

}
