import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { InicioPage } from './inicio.page';
import { RouterModule } from '@angular/router';
import { MaquinaTareaPageModule } from '../maquina-tarea/maquina-tarea.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    ComponentsModule,
    RouterModule,
    MaquinaTareaPageModule
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}
