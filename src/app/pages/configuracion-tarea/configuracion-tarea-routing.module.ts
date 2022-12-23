import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracionTareaPage } from './configuracion-tarea.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionTareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionTareaPageRoutingModule {}
