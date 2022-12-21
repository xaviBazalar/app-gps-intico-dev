import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TomaTiempoPageRoutingModule } from './toma-tiempo-routing.module';

import { TomaTiempoPage } from './toma-tiempo.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TomaTiempoPageRoutingModule
  ],
  declarations: [TomaTiempoPage]
})
export class TomaTiempoPageModule {}
