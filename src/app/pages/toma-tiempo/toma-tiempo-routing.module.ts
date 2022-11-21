import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TomaTiempoPage } from './toma-tiempo.page';

const routes: Routes = [
  {
    path: '',
    component: TomaTiempoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TomaTiempoPageRoutingModule {}
