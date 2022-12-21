import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TomarFotoPageRoutingModule } from './tomar-foto-routing.module';

import { TomarFotoPage } from './tomar-foto.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TomarFotoPageRoutingModule
  ],
  declarations: [TomarFotoPage]
})
export class TomarFotoPageModule {}
