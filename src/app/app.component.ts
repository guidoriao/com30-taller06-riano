import { Component } from '@angular/core';
import { FormularioRequisicionComponent } from './components/formulario-requisicion';
import { ListadoRequisicionesComponent } from './components/listado-requisiciones';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [FormularioRequisicionComponent, ListadoRequisicionesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Requisición de Compra';
}
