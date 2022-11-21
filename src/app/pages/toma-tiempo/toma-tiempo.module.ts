import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TomaTiempoPageRoutingModule } from './toma-tiempo-routing.module';

import { TomaTiempoPage } from './toma-tiempo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TomaTiempoPageRoutingModule
  ],
  declarations: [TomaTiempoPage]
})
export class TomaTiempoPageModule {}
