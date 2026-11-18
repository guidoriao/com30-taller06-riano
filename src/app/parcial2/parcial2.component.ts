import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { multiploDe, rangoFechasValido } from './validadores';
import { RequisicionService } from '../services/requisicion.service';

@Component({
  selector: 'app-parcial2',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto space-y-6">
      <h2 class="text-2xl font-bold">Parcial 2 · Solicitud y Búsqueda Reactiva (d = 0)</h2>

      <!-- FORMULARIO R1 -->
      <form [formGroup]="form" (ngSubmit)="enviar()" class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        <div>
          <label class="block font-semibold mb-1">Código (Ej. AB123)</label>
          <input type="text" formControlName="codigo" class="w-full border p-2 rounded" placeholder="AB123" />
          @if (form.controls.codigo.invalid && (form.controls.codigo.touched || form.controls.codigo.dirty)) {
            <div class="text-red-600 text-sm mt-1">
              @if (form.controls.codigo.hasError('required')) { <span>El código es obligatorio.</span> }
              @if (form.controls.codigo.hasError('pattern')) { <span>Debe tener 2 mayúsculas y 3 dígitos (ej. AB123).</span> }
            </div>
          }
        </div>

        <div>
          <label class="block font-semibold mb-1">Cantidad (1 a 8, múltiplo de 2)</label>
          <input type="number" formControlName="cantidad" class="w-full border p-2 rounded" />
          @if (form.controls.cantidad.invalid && (form.controls.cantidad.touched || form.controls.cantidad.dirty)) {
            <div class="text-red-600 text-sm mt-1">
              @if (form.controls.cantidad.hasError('required')) { <span>La cantidad es obligatoria. </span> }
              @if (form.controls.cantidad.hasError('min')) { <span>Mínimo 1. </span> }
              @if (form.controls.cantidad.hasError('max')) { <span>Máximo 8. </span> }
              @if (form.controls.cantidad.hasError('multiplo')) { <span>Debe ser múltiplo de 2. </span> }
            </div>
          }
        </div>

        <div>
          <label class="block font-semibold mb-1">Desde</label>
          <input type="number" formControlName="desde" class="w-full border p-2 rounded" />
          @if (form.controls.desde.invalid && (form.controls.desde.touched || form.controls.desde.dirty)) {
            <div class="text-red-600 text-sm mt-1"><span>Campo obligatorio.</span></div>
          }
        </div>

        <div>
          <label class="block font-semibold mb-1">Hasta</label>
          <input type="number" formControlName="hasta" class="w-full border p-2 rounded" />
          @if (form.controls.hasta.invalid && (form.controls.hasta.touched || form.controls.hasta.dirty)) {
            <div class="text-red-600 text-sm mt-1"><span>Campo obligatorio.</span></div>
          }
        </div>

        @if (form.hasError('hastaMayor') && (form.controls.hasta.touched || form.controls.hasta.dirty || form.controls.desde.touched)) {
          <div class="col-span-full bg-red-100 text-red-700 p-2 rounded text-sm">
            El campo "Hasta" debe ser mayor que "Desde".
          </div>
        }

        <div class="col-span-full">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Guardar y Ver Detalle
          </button>
        </div>
      </form>

      <!-- BÚSQUEDA REACTIVA R2 -->
      <div class="bg-white p-6 rounded shadow space-y-4">
        <h3 class="text-lg font-bold">Búsqueda Reactiva en el Listado</h3>
        <div>
          <label class="block font-semibold mb-1">Buscar:</label>
          <input type="text" [formControl]="buscarControl" placeholder="Escribe para filtrar (ej. lote, sistemas)..." class="w-full border p-2 rounded" />
        </div>

        <div class="flex gap-6 text-sm bg-slate-100 p-3 rounded font-mono">
          <span>Último valor: <strong>{{ ultimoValor() }}</strong></span>
          <span>Emisiones: <strong>{{ emisiones() }}</strong></span>
        </div>

        <!-- Listado filtrado -->
        <div class="border-t pt-3">
          <p class="text-sm text-slate-500 mb-2">Registros coincidentes ({{ registrosFiltrados().length }}):</p>
          <ul class="divide-y">
            @for (item of registrosFiltrados(); track item.id) {
              <li class="py-2 flex justify-between">
                <span><strong>{{ item.id }}</strong> - {{ item.solicitante }} ({{ item.area }})</span>
                <span class="text-sm text-slate-600">{{ item.justificacion }}</span>
              </li>
            } @empty {
              <li class="py-2 text-slate-400 italic">No hay registros que coincidan con "{{ ultimoValor() }}"</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `
})
export class Parcial2Component {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private servicio = inject(RequisicionService);

  readonly M = 2;
  readonly TOPE = 8;

  form = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{3}$/)]],
    cantidad: [2, [Validators.required, Validators.min(1), Validators.max(this.TOPE), multiploDe(this.M)]],
    desde: [1, [Validators.required]],
    hasta: [2, [Validators.required]]
  }, { validators: [rangoFechasValido] });

  buscarControl = new FormControl('', { nonNullable: true });
  ultimoValor = signal<string>('');
  emisiones = signal<number>(0);

  registrosFiltrados = computed(() => {
    const filtro = this.ultimoValor().toLowerCase();
    const lista = this.servicio.requisiciones();
    if (!filtro) return lista;
    return lista.filter(r =>
      JSON.stringify(r).toLowerCase().includes(filtro)
    );
  });

  constructor() {
    this.buscarControl.valueChanges.pipe(
      map(val => val.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(valorLimpio => {
      this.ultimoValor.set(valorLimpio);
      this.emisiones.update(n => n + 1);
    });
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { codigo, cantidad } = this.form.getRawValue();
    this.router.navigate(['/parcial2/detalle', codigo], { queryParams: { cantidad } });
  }
}