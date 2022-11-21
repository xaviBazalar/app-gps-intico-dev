import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignaTareaPage } from './asigna-tarea.page';

const routes: Routes = [
  {
    path: '',
    component: AsignaTareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignaTareaPageRoutingModule {}
