import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteDiarioPageRoutingModule } from './reporte-diario-routing.module';

import { ReporteDiarioPage } from './reporte-diario.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReporteDiarioPageRoutingModule
  ],
  declarations: [ReporteDiarioPage]
})
export class ReporteDiarioPageModule {}
