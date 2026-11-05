import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of
} from 'rxjs';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RequisicionService } from '../services/requisicion.service';
import { Requisicion } from '../models/requisicion.model';

@Component({
  standalone: true,
  selector: 'app-buscador-requisiciones',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './buscador-requisiciones.html',
  styleUrl: './buscador-requisiciones.css'
})
export class BuscadorRequisicionesComponent {
  private requisicionService = inject(RequisicionService);

  // R2: FormControl con valueChanges + map(trim) + debounceTime(300) + distinctUntilChanged
  busqueda = new FormControl('', { nonNullable: true });

  // R3: switchMap hacia el servicio, of([]) si menos de 2 caracteres
  resultado$ = this.busqueda.valueChanges.pipe(
    map(t => t.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(texto => {
      if (texto.length < 2) {
        return of([]);
      }
      return this.requisicionService.buscar(texto);
    })
  );

  // R4: toSignal con valor inicial
  resultados = toSignal(this.resultado$, { initialValue: [] as Requisicion[] });

  // Mensajes de estado (R7)
  estadoMensaje = signal<string>('');

  // Historial de las 5 últimas consultas (R6)
  historial = signal<string[]>([]);

  // Filtro por estado (R5)
  filtroEstado = signal<'Todos' | 'Pendiente' | 'Aprobado' | 'Rechazado'>('Todos');

  // R4: computed con total y conteo por estado de lo que se muestra
  visibles = computed(() => {
    const lista = this.resultados();
    const filtro = this.filtroEstado();
    if (filtro === 'Todos') {
      return lista;
    }
    return lista.filter(r => r.estado === filtro);
  });

  totalVisibles = computed(() => this.visibles().length);
  pendientesVisibles = computed(() => this.visibles().filter(r => r.estado === 'Pendiente').length);
  aprobadosVisibles = computed(() => this.visibles().filter(r => r.estado === 'Aprobado').length);
  rechazadosVisibles = computed(() => this.visibles().filter(r => r.estado === 'Rechazado').length);

  constructor() {
    // R6, R7: suscripción con takeUntilDestroyed (cancelación automática al destruir)
    this.resultado$.pipe(takeUntilDestroyed()).subscribe(resultados => {
      const texto = this.busqueda.value.trim();

      // Agregar al historial (máximo 5, más reciente primero, sin duplicados)
      if (texto.length >= 2) {
        this.historial.update(h => [texto, ...h.filter(h => h !== texto)].slice(0, 5));
      }

      // Mensajes de estado
      if (texto.length > 0 && texto.length < 2) {
        this.estadoMensaje.set('Mínimo 2 caracteres para buscar');
      } else if (resultados.length === 0 && texto.length >= 2) {
        this.estadoMensaje.set('Sin coincidencias');
      } else if (resultados.length > 0) {
        this.estadoMensaje.set(`${resultados.length} registro(s) encontrado(s)`);
      } else {
        this.estadoMensaje.set('');
      }
    });
  }

  cambiarFiltro(estado: 'Todos' | 'Pendiente' | 'Aprobado' | 'Rechazado') {
    this.filtroEstado.set(estado);
  }

  limpiar() {
    this.busqueda.setValue('');
    this.filtroEstado.set('Todos');
    this.estadoMensaje.set('');
  }
}
