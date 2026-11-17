import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RequisicionService } from '../services/requisicion.service';
import { Requisicion } from '../models/requisicion.model';

@Component({
  standalone: true,
  selector: 'app-listado-requisiciones',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="bg-white p-6 rounded shadow border border-gray-200">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Listado de Requisiciones</h2>
          <p class="text-gray-600 text-sm">
            Total: {{ totalRegistros() }} &bull; Pendientes: {{ pendientes() }}
          </p>
        </div>
        <a
          routerLink="/requisiciones/nueva"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium"
          >Nueva Requisición</a
        >
      </div>

      <!-- Filtros por estado con routerLink y queryParams -->
      <div class="flex flex-wrap gap-2 mb-6">
        <a
          routerLink="."
          [queryParams]="{ estado: null }"
          [class]="
            filtroActivo() === 'Todos'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
          class="px-3 py-1 rounded text-sm hover:bg-indigo-500 hover:text-white transition"
          >Todos</a
        >
        <a
          routerLink="."
          [queryParams]="{ estado: 'Pendiente' }"
          [class]="
            filtroActivo() === 'Pendiente'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
          class="px-3 py-1 rounded text-sm hover:bg-yellow-500 hover:text-white transition"
          >Pendiente</a
        >
        <a
          routerLink="."
          [queryParams]="{ estado: 'Aprobado' }"
          [class]="
            filtroActivo() === 'Aprobado'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
          class="px-3 py-1 rounded text-sm hover:bg-green-500 hover:text-white transition"
          >Aprobada</a
        >
        <a
          routerLink="."
          [queryParams]="{ estado: 'Rechazado' }"
          [class]="
            filtroActivo() === 'Rechazado'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
          class="px-3 py-1 rounded text-sm hover:bg-red-500 hover:text-white transition"
          >Rechazado</a
        >
      </div>

      @if (requisicionesVisibles().length === 0) {
        <div class="text-center py-8 text-gray-500">
          @if (filtroActivo() && filtroActivo() !== 'Todos') {
            <p>No hay requisiciones con estado "{{ filtroActivo() }}"</p>
          } @else {
            <p>No hay requisiciones registradas.</p>
          }
          <a routerLink="/requisiciones/nueva" class="text-indigo-600 hover:underline"
            >Crear una nueva</a
          >
        </div>
      } @else {
        <table class="min-w-full bg-white border border-gray-200 rounded overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 border text-left text-sm font-semibold">Código</th>
              <th class="p-3 border text-left text-sm font-semibold">Solicitante</th>
              <th class="p-3 border text-left text-sm font-semibold">Área</th>
              <th class="p-3 border text-left text-sm font-semibold">Fecha Requerida</th>
              <th class="p-3 border text-left text-sm font-semibold">Prioridad</th>
              <th class="p-3 border text-left text-sm font-semibold">Estado</th>
              <th class="p-3 border text-center text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (r of requisicionesVisibles(); track r.id) {
              <tr class="border-b hover:bg-gray-50">
                <td class="p-3 border text-sm font-mono">{{ r.id }}</td>
                <td class="p-3 border text-sm">{{ r.solicitante }}</td>
                <td class="p-3 border text-sm">{{ r.area }}</td>
                <td class="p-3 border text-sm">{{ r.fechaRequerida }}</td>
                <td class="p-3 border text-sm">
                  <span
                    class="text-xs font-medium"
                    [class]="
                      r.prioridad === 'Alta'
                        ? 'text-red-600'
                        : r.prioridad === 'Media'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    "
                    >{{ r.prioridad }}</span
                  >
                </td>
                <td class="p-3 border text-sm">
                  <span
                    class="px-2 py-1 rounded text-xs font-medium"
                    [class]="
                      r.estado === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : r.estado === 'Aprobado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                    >{{ r.estado }}</span
                  >
                </td>
                <td class="p-3 border text-center">
                  <div class="flex justify-center gap-2">
                    <a
                      [routerLink]="['/requisiciones', r.id]"
                      class="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                      >Ver detalle</a
                    >
                    @if (r.estado === 'Pendiente') {
                      <button
                        (click)="aprobar(r.id)"
                        class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Aprobar
                      </button>
                      <button
                        (click)="rechazar(r.id)"
                        class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Rechazar
                      </button>
                    }
                    <button
                      (click)="eliminar(r.id)"
                      class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: []
})
export class ListadoRequisicionesComponent {
  requisicionService = inject(RequisicionService);

  // input de consulta ?estado=...
  estado = input<string>('Todos');

  requisiciones = this.requisicionService.requisiciones;
  totalRegistros = this.requisicionService.totalRegistros;
  pendientes = this.requisicionService.pendientes;

  filtroActivo = computed(() => this.estado() || 'Todos');

  requisicionesVisibles = computed(() => {
    const lista = this.requisiciones();
    const filtro = this.filtroActivo();
    if (filtro === 'Todos') {
      return lista;
    }
    return lista.filter((r) => r.estado === filtro);
  });

  aprobar(id: string) {
    this.requisicionService.cambiarEstado(id, 'Aprobado');
  }

  rechazar(id: string) {
    this.requisicionService.cambiarEstado(id, 'Rechazado');
  }

  eliminar(id: string) {
    if (confirm('¿Está seguro de eliminar esta requisición?')) {
      this.requisicionService.eliminar(id);
    }
  }
}
