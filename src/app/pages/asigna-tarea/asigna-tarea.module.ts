import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaTareaPageRoutingModule } from './asigna-tarea-routing.module';

import { AsignaTareaPage } from './asigna-tarea.page';
import { MaquinaTareaPage } from '../maquina-tarea/maquina-tarea.page';
import { MaquinaTareaPageModule } from '../maquina-tarea/maquina-tarea.module';

@NgModule({
  entryComponents: [
    MaquinaTareaPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignaTareaPageRoutingModule,
    MaquinaTareaPageModule
  ],
  declarations: [AsignaTareaPage]
})
export class AsignaTareaPageModule {}
