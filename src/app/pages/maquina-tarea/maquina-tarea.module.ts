import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaquinaTareaPageRoutingModule } from './maquina-tarea-routing.module';

import { MaquinaTareaPage } from './maquina-tarea.page';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MaquinaTareaPageRoutingModule
  ],
  declarations: [MaquinaTareaPage]
})
export class MaquinaTareaPageModule {}
