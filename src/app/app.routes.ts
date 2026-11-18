import { Routes } from '@angular/router';
import { ListadoRequisicionesComponent } from './components/listado-requisiciones';
import { FormularioRequisicionComponent } from './components/formulario-requisicion';
import { DetalleRequisicionComponent } from './components/detalle-requisicion';
import { EstadisticasComponent } from './components/estadisticas/estadisticas';
import { NoEncontradaComponent } from './components/no-encontrada';
import { Parcial2Component } from './parcial2/parcial2.component';
import { DetalleParcial2Component } from './parcial2/detalle-parcial2.component';

export const routes: Routes = [
  { path: '', redirectTo: 'requisiciones', pathMatch: 'full' },
  {
    path: 'requisiciones',
    component: ListadoRequisicionesComponent,
    title: 'Requisiciones'
  },
  {
    path: 'requisiciones/nueva',
    component: FormularioRequisicionComponent,
    title: 'Nueva Requisición'
  },
  {
    path: 'requisiciones/:id',
    component: DetalleRequisicionComponent,
    title: 'Detalle de Requisición'
  },
  {
    path: 'estadisticas',
    loadComponent: () =>
      import('./components/estadisticas/estadisticas').then(
        (m) => m.EstadisticasComponent
      ),
    title: 'Estadísticas'
  },
{ path: 'parcial2', component: Parcial2Component, title: 'Parcial 2' },
  { path: 'parcial2/detalle/:codigo', component: DetalleParcial2Component, title: 'Detalle Parcial 2' },
  { path: '**', component: NoEncontradaComponent, title: 'Página no encontrada' }
];
