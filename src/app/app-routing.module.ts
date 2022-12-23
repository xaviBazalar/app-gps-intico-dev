import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'recuperar-password',
    loadChildren: () => import('./pages/recuperar-password/recuperar-password.module').then( m => m.RecuperarPasswordPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'asigna-tarea',
    loadChildren: () => import('./pages/asigna-tarea/asigna-tarea.module').then( m => m.AsignaTareaPageModule)
  },
  {
    path: 'configuracion-tarea',
    loadChildren: () => import('./pages/configuracion-tarea/configuracion-tarea.module').then( m => m.ConfiguracionTareaPageModule)
  },
  {
    path: 'maquina-tarea/:idMaquina/:idUser/:idTarea/:idMaquinaInterna',
    loadChildren: () => import('./pages/maquina-tarea/maquina-tarea.module').then( m => m.MaquinaTareaPageModule)
  },
  {
    path: 'tomar-foto',
    loadChildren: () => import('./pages/tomar-foto/tomar-foto.module').then( m => m.TomarFotoPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'toma-tiempo',
    loadChildren: () => import('./pages/toma-tiempo/toma-tiempo.module').then( m => m.TomaTiempoPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'reporte-diario',
    loadChildren: () => import('./pages/reporte-diario/reporte-diario.module').then( m => m.ReporteDiarioPageModule)
  },
  {
    path: 'configuracion-tarea',
    loadChildren: () => import('./pages/configuracion-tarea/configuracion-tarea.module').then( m => m.ConfiguracionTareaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
