import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarPasswordPageRoutingModule } from './recuperar-password-routing.module';

import { RecuperarPasswordPage } from './recuperar-password.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RecuperarPasswordPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RecuperarPasswordPage]
})
export class RecuperarPasswordPageModule {}
