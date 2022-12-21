import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { InfouserComponent } from './infouser/infouser.component';



@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    InfouserComponent
  ],
  exports:[
    HeaderComponent,
    MenuComponent,
    InfouserComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
