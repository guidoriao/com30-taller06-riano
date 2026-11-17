import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisicionService } from '../../services/requisicion.service';

@Component({
  standalone: true,
  selector: 'app-estadisticas',
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded shadow border border-gray-200 max-w-lg mx-auto mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="p-4 bg-blue-50 rounded border border-blue-200 text-center">
          <div class="text-blue-600 text-xs font-semibold uppercase tracking-wider">Total</div>
          <div class="text-3xl font-bold text-gray-900">{{ totalRequisiciones() }}</div>
        </div>
        <div class="p-4 bg-yellow-50 rounded border border-yellow-200 text-center">
          <div class="text-yellow-600 text-xs font-semibold uppercase tracking-wider">Pendientes</div>
          <div class="text-3xl font-bold text-gray-900">{{ pendientes() }}</div>
        </div>
        <div class="p-4 bg-green-50 rounded border border-green-200 text-center">
          <div class="text-green-600 text-xs font-semibold uppercase tracking-wider">Aprobadas</div>
          <div class="text-3xl font-bold text-gray-900">{{ aprobadas() }}</div>
        </div>
        <div class="p-4 bg-red-50 rounded border border-red-200 text-center">
          <div class="text-red-600 text-xs font-semibold uppercase tracking-wider">Rechazadas</div>
          <div class="text-3xl font-bold text-gray-900">{{ rechazadas() }}</div>
        </div>
        <div class="p-4 bg-indigo-50 rounded border border-indigo-200 text-center">
          <div class="text-indigo-600 text-xs font-semibold uppercase tracking-wider">Valor total</div>
          <div class="text-3xl font-bold text-gray-900">{{ valorTotalPresupuesto() }}</div>
        </div>
        <div class="p-4 bg-purple-50 rounded border border-purple-200 text-center">
          <div class="text-purple-600 text-xs font-semibold uppercase tracking-wider">Llamadas al servicio</div>
          <div class="text-3xl font-bold text-gray-900">{{ requisicionService.llamadas() }}</div>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-lg font-bold text-gray-800 mb-3">Distribución por estado</h3>
        @for (estado of estados(); track estado) {
          <div class="flex items-center gap-4 p-3 bg-gray-50 rounded border border-gray-200">
            <span class="w-20 text-sm font-medium text-gray-700 uppercase">{{ estado }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full"
                [style.width.%]="porcentajeEstado(estado)"
              ></div>
            </div>
            <span class="w-10 text-sm font-mono text-gray-600">{{ conteoEstado(estado) }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class EstadisticasComponent {
  requisicionService = inject(RequisicionService);

  totalRequisiciones = computed(() => this.requisicionService.totalRegistros());
  pendientes = computed(() => this.requisicionService.pendientes());
  aprobadas = computed(() =>
    this.requisicionService.requisiciones().filter((r) => r.estado === 'Aprobado').length
  );
  rechazadas = computed(() =>
    this.requisicionService.requisiciones().filter((r) => r.estado === 'Rechazado').length
  );

  valorTotalPresupuesto = computed(() => {
    return this.requisicionService
      .requisiciones()
      .reduce(
        (sum, r) =>
          sum +
          r.articulos.reduce((aSum, a) => aSum + a.cantidad * a.valorUnitario, 0),
        0
      );
  });

  estados = computed(() => ['Pendiente', 'Aprobado', 'Rechazado']);

  conteoEstado = (estado: string) =>
    this.requisicionService
      .requisiciones()
      .filter((r) => r.estado === estado).length;

  porcentajeEstado = (estado: string) => {
    const total = this.totalRequisiciones();
    if (total === 0) return 0;
    return Math.round((this.conteoEstado(estado) / total) * 100);
  };
}
