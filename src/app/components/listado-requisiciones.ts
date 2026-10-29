import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisicionService } from '../services/requisicion.service';
import { Requisicion } from '../models/requisicion.model';

@Component({
  standalone: true,
  selector: 'app-listado-requisiciones',
  imports: [CommonModule],
  templateUrl: './listado-requisiciones.html',
  styleUrl: './listado-requisiciones.css'
})
export class ListadoRequisicionesComponent {
  requisicionService = inject(RequisicionService);
  requisiciones = this.requisicionService.requisiciones;
  totalRegistros = this.requisicionService.totalRegistros;
  pendientes = this.requisicionService.pendientes;

  aprobar(id: number) {
    this.requisicionService.cambiarEstado(id, 'Aprobado');
  }

  rechazar(id: number) {
    this.requisicionService.cambiarEstado(id, 'Rechazado');
  }

  eliminar(id: number) {
    this.requisicionService.eliminar(id);
  }
}
