import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequisicionService } from '../services/requisicion.service';
import { Requisicion } from '../models/requisicion.model';

@Component({
  standalone: true,
  selector: 'app-detalle-requisicion',
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded shadow border border-gray-200 max-w-2xl mx-auto mt-8">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Detalle de Requisición</h2>
          <p class="text-gray-600 text-sm">Código: {{ id() }}</p>
        </div>
        <button
          (click)="volver()"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          Volver al listado
        </button>
      </div>

      @if (requisicion()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-500 uppercase">Solicitante</label>
            <p class="text-gray-800">{{ requisicion()!.solicitante }}</p>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-500 uppercase">Área</label>
            <p class="text-gray-800">{{ requisicion()!.area }}</p>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-500 uppercase">Fecha Solicitud</label>
            <p class="text-gray-800">{{ requisicion()!.fechaSolicitud }}</p>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-500 uppercase">Fecha Requerida</label>
            <p class="text-gray-800">{{ requisicion()!.fechaRequerida }}</p>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-500 uppercase">Prioridad</label>
            <p
              class="text-gray-800 font-semibold"
              [class]="
                requisicion()!.prioridad === 'Alta'
                  ? 'text-red-600'
                  : requisicion()!.prioridad === 'Media'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              "
            >
              {{ requisicion()!.prioridad }}
            </p>
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-medium text-gray-500 uppercase">Estado</label>
            <p
              class="text-gray-800 font-semibold"
              [class]="
                requisicion()!.estado === 'Pendiente'
                  ? 'text-yellow-600'
                  : requisicion()!.estado === 'Aprobado'
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{ requisicion()!.estado }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-medium text-gray-500 uppercase">Justificación</label>
          <p class="text-gray-800 whitespace-pre-line">{{ requisicion()!.justificacion }}</p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-3 border text-left text-xs font-semibold">Descripción</th>
                <th class="p-3 border text-left text-xs font-semibold">Cantidad</th>
                <th class="p-3 border text-left text-xs font-semibold">Valor Unitario</th>
                <th class="p-3 border text-left text-xs font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              @for (art of requisicion()!.articulos; track art.descripcion) {
                <tr class="border-b hover:bg-gray-50">
                  <td class="p-3 border text-sm">{{ art.descripcion }}</td>
                  <td class="p-3 border text-sm">{{ art.cantidad }}</td>
                  <td class="p-3 border text-sm">{{ art.valorUnitario }}</td>
                  <td class="p-3 border text-sm font-semibold">
                    {{ (art.cantidad * art.valorUnitario).toLocaleString() }}
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr class="bg-gray-50 font-bold">
                <td colspan="3" class="p-3 border text-right">Total:</td>
                <td class="p-3 border text-sm">{{ totalArticulos().toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="mt-6 flex gap-3">
          @if (requisicion()!.estado === 'Pendiente') {
            <button
              (click)="cambiarEstado('Aprobado')"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Aprobar
            </button>
            <button
              (click)="cambiarEstado('Rechazado')"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Rechazar
            </button>
          }
          <button
            (click)="eliminar()"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Eliminar
          </button>
        </div>
      } @else {
        <div class="text-center py-8">
          <h3 class="text-lg font-bold text-red-700">No existe la requisición {{ id() }}</h3>
          <button
            (click)="volver()"
            class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Volver al listado
          </button>
        </div>
      }
    </div>
  `,
  styles: []
})
export class DetalleRequisicionComponent {
  private requisicionService = inject(RequisicionService);
  private router = inject(Router);

  id = input.required<string>();

  requisicion = computed(() => {
    return this.requisicionService.requisiciones().find((r) => r.id === this.id());
  });

  totalArticulos = computed(() => {
    const req = this.requisicion();
    if (!req) return 0;
    return req.articulos.reduce((sum, a) => sum + a.cantidad * a.valorUnitario, 0);
  });

  volver() {
    this.router.navigate(['/requisiciones']);
  }

  cambiarEstado(nuevoEstado: 'Aprobado' | 'Rechazado' | 'Pendiente') {
    this.requisicionService.cambiarEstado(this.id(), nuevoEstado);
  }

  eliminar() {
    if (confirm('¿Está seguro de eliminar esta requisición?')) {
      this.requisicionService.eliminar(this.id());
      this.router.navigate(['/requisiciones']);
    }
  }
}
