import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracionTareaPageRoutingModule } from './configuracion-tarea-routing.module';

import { ConfiguracionTareaPage } from './configuracion-tarea.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ConfiguracionTareaPageRoutingModule
  ],
  declarations: [ConfiguracionTareaPage]
})
export class ConfiguracionTareaPageModule {}
