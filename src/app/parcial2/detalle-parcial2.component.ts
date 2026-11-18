import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-parcial2',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="p-6 max-w-xl mx-auto bg-white rounded shadow mt-6">
      <h2 class="text-xl font-bold mb-4">Detalle de Solicitud</h2>

      @if (!esCodigoValido()) {
        <div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          <strong>Código inválido:</strong> El código "{{ codigo() }}" no cumple el formato (2 mayúsculas y 3 dígitos).
        </div>
      } @else {
        <ul class="space-y-2 border p-4 rounded bg-slate-50 mb-4">
          <li><strong>Código:</strong> {{ codigo() }}</li>
          <li><strong>Cantidad:</strong> {{ cantidadNum() }}</li>
          <li><strong>Bloques (cantidad / 2):</strong> {{ bloques() }}</li>
          <li><strong>Margen (8 - cantidad):</strong> {{ margen() }}</li>
        </ul>
      }

      <a routerLink="/parcial2" class="text-blue-600 underline font-semibold">← Volver al formulario</a>
    </div>
  `
})
export class DetalleParcial2Component {
  readonly M = 2;
  readonly TOPE = 8;

  codigo = input.required<string>();
  cantidad = input<string>('0');

  esCodigoValido = computed(() => /^[A-Z]{2}[0-9]{3}$/.test(this.codigo()));
  cantidadNum = computed(() => Number(this.cantidad()) || 0);
  bloques = computed(() => this.cantidadNum() / this.M);
  margen = computed(() => this.TOPE - this.cantidadNum());
}