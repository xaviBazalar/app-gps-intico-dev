import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaquinaTareaPage } from './maquina-tarea.page';

const routes: Routes = [
  {
    path: '',
    component: MaquinaTareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaquinaTareaPageRoutingModule {}
