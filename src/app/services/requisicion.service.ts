import { Injectable, computed, signal } from '@angular/core';
import { Requisicion } from '../models/requisicion.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicionService {
  #requisiciones = signal<Requisicion[]>([]);
  requisiciones = this.#requisiciones.asReadonly();

  totalRegistros = computed(() => this.#requisiciones().length);
  pendientes = computed(() => this.#requisiciones().filter(r => r.estado === 'Pendiente').length);

  agregar(requisicion: Omit<Requisicion, 'id'>) {
    const ids = this.#requisiciones().map(r => r.id);
    const id = ids.length ? Math.max(...ids) + 1 : 1;
    const nueva: Requisicion = { ...requisicion, id, estado: 'Pendiente' };
    this.#requisiciones.update(lista => [...lista, nueva]);
  }

  cambiarEstado(id: number, nuevoEstado: 'Aprobado' | 'Rechazado') {
    this.#requisiciones.update(lista => lista.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
  }

  eliminar(id: number) {
    this.#requisiciones.update(lista => lista.filter(r => r.id !== id));
  }
}
