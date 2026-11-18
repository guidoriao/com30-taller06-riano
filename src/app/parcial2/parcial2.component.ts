import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { multiploDe, rangoFechasValido } from './validadores';

@Component({
  selector: 'app-parcial2',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Parcial 2 · Registro de Solicitud (d = 0)</h2>

      <form [formGroup]="form" (ngSubmit)="enviar()" class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        
        <!-- Campo Código -->
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

        <!-- Campo Cantidad -->
        <div>
          <label class="block font-semibold mb-1">Cantidad (1 a 8, múltiplo de 2)</label>
          <input type="number" formControlName="cantidad" class="w-full border p-2 rounded" />
          @if (form.controls.cantidad.invalid && (form.controls.cantidad.touched || form.controls.cantidad.dirty)) {
            <div class="text-red-600 text-sm mt-1">
              @if (form.controls.cantidad.hasError('required')) { <span>La cantidad es obligatoria. </span> }
              @if (form.controls.cantidad.hasError('min')) { <span>El mínimo permitido es 1. </span> }
              @if (form.controls.cantidad.hasError('max')) { <span>El máximo permitido es 8. </span> }
              @if (form.controls.cantidad.hasError('multiplo')) { <span>Debe ser múltiplo de 2. </span> }
            </div>
          }
        </div>

        <!-- Campo Desde -->
        <div>
          <label class="block font-semibold mb-1">Desde</label>
          <input type="number" formControlName="desde" class="w-full border p-2 rounded" />
          @if (form.controls.desde.invalid && (form.controls.desde.touched || form.controls.desde.dirty)) {
            <div class="text-red-600 text-sm mt-1">
              @if (form.controls.desde.hasError('required')) { <span>Campo obligatorio.</span> }
            </div>
          }
        </div>

        <!-- Campo Hasta -->
        <div>
          <label class="block font-semibold mb-1">Hasta</label>
          <input type="number" formControlName="hasta" class="w-full border p-2 rounded" />
          @if (form.controls.hasta.invalid && (form.controls.hasta.touched || form.controls.hasta.dirty)) {
            <div class="text-red-600 text-sm mt-1">
              @if (form.controls.hasta.hasError('required')) { <span>Campo obligatorio.</span> }
            </div>
          }
        </div>

        <!-- Error de Grupo -->
        @if (form.hasError('hastaMayor') && (form.controls.hasta.touched || form.controls.hasta.dirty || form.controls.desde.touched)) {
          <div class="col-span-full bg-red-100 text-red-700 p-2 rounded text-sm">
            Error de rango: El campo "Hasta" debe ser estrictamente mayor que "Desde".
          </div>
        }

        <div class="col-span-full mt-2">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Guardar y Ver Detalle
          </button>
        </div>
      </form>
    </div>
  `
})
export class Parcial2Component {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly M = 2;
  readonly TOPE = 8;

  form = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{3}$/)]],
    cantidad: [2, [Validators.required, Validators.min(1), Validators.max(this.TOPE), multiploDe(this.M)]],
    desde: [1, [Validators.required]],
    hasta: [2, [Validators.required]]
  }, { validators: [rangoFechasValido] });

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { codigo, cantidad } = this.form.getRawValue();
    this.router.navigate(['/parcial2/detalle', codigo], { queryParams: { cantidad } });
  }
}