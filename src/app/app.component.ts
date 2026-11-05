import { Component } from '@angular/core';
import { FormularioRequisicionComponent } from './components/formulario-requisicion';
import { ListadoRequisicionesComponent } from './components/listado-requisiciones';
import { BuscadorRequisicionesComponent } from './components/buscador-requisiciones';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [FormularioRequisicionComponent, ListadoRequisicionesComponent, BuscadorRequisicionesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Requisición de Compra';
}
