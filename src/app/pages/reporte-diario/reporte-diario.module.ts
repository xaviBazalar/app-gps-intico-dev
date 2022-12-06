import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteDiarioPageRoutingModule } from './reporte-diario-routing.module';

import { ReporteDiarioPage } from './reporte-diario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteDiarioPageRoutingModule
  ],
  declarations: [ReporteDiarioPage]
})
export class ReporteDiarioPageModule {}
