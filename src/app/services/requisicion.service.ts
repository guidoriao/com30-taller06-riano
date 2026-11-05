import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Requisicion } from '../models/requisicion.model';

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

@Injectable({
  providedIn: 'root'
})
export class RequisicionService {
  #requisiciones = signal<Requisicion[]>([]);
  requisiciones = this.#requisiciones.asReadonly();

  #llamadas = signal(0);
  llamadas = this.#llamadas.asReadonly();

  totalRegistros = computed(() => this.#requisiciones().length);
  pendientes = computed(() => this.#requisiciones().filter(r => r.estado === 'Pendiente').length);

  constructor() {
    this.#cargarSemilla();
  }

  #cargarSemilla() {
    const semilla: Omit<Requisicion, 'id'>[] = [
      {
        solicitante: 'Juan Pérez',
        area: 'Sistemas',
        fechaSolicitud: '01/11/2026',
        fechaRequerida: '05/11/2026',
        justificacion: 'Compra de equipos de cómputo para la oficina',
        prioridad: 'Alta',
        articulos: [
          { descripcion: 'Laptop', cantidad: 2, valorUnitario: 1500 },
          { descripcion: 'Mouse', cantidad: 5, valorUnitario: 25 }
        ],
        estado: 'Pendiente'
      },
      {
        solicitante: 'María Gómez',
        area: 'Contabilidad',
        fechaSolicitud: '02/11/2026',
        fechaRequerida: '06/11/2026',
        justificacion: 'Sillas ergonómicas para área administrativa',
        prioridad: 'Media',
        articulos: [
          { descripcion: 'Silla ergonómica', cantidad: 4, valorUnitario: 300 }
        ],
        estado: 'Aprobado'
      },
      {
        solicitante: 'Carlos Ruiz',
        area: 'Sistemas',
        fechaSolicitud: '03/11/2026',
        fechaRequerida: '07/11/2026',
        justificacion: 'Licencias de software antivirus anuales',
        prioridad: 'Alta',
        articulos: [
          { descripcion: 'Antivirus', cantidad: 20, valorUnitario: 45 }
        ],
        estado: 'Pendiente'
      },
      {
        solicitante: 'Ana Torres',
        area: 'Recursos Humanos',
        fechaSolicitud: '03/11/2026',
        fechaRequerida: '08/11/2026',
        justificacion: 'Capacitación en normativa laboral',
        prioridad: 'Baja',
        articulos: [
          { descripcion: 'Curso virtual', cantidad: 1, valorUnitario: 120 },
          { descripcion: 'Material impreso', cantidad: 10, valorUnitario: 12 }
        ],
        estado: 'Rechazado'
      },
      {
        solicitante: 'Luis Mendoza',
        area: 'Sistemas',
        fechaSolicitud: '04/11/2026',
        fechaRequerida: '09/11/2026',
        justificacion: 'Servidores de respaldo para base de datos',
        prioridad: 'Alta',
        articulos: [
          { descripcion: 'Servidor', cantidad: 1, valorUnitario: 8000 },
          { descripcion: 'Disco duro', cantidad: 4, valorUnitario: 200 }
        ],
        estado: 'Pendiente'
      },
      {
        solicitante: 'Elena Díaz',
        area: 'Mercadeo',
        fechaSolicitud: '05/11/2026',
        fechaRequerida: '10/11/2026',
        justificacion: 'Material promocional para feria universitaria',
        prioridad: 'Media',
        articulos: [
          { descripcion: 'Flyers', cantidad: 500, valorUnitario: 0.5 },
          { descripcion: 'Banner', cantidad: 2, valorUnitario: 80 }
        ],
        estado: 'Aprobado'
      },
      {
        solicitante: 'Pedro Jiménez',
        area: 'Sistemas',
        fechaSolicitud: '05/11/2026',
        fechaRequerida: '11/11/2026',
        justificacion: 'Cableado estructurado para nueva sede',
        prioridad: 'Alta',
        articulos: [
          { descripcion: 'Cable UTP', cantidad: 300, valorUnitario: 0.8 },
          { descripcion: 'Conectores RJ45', cantidad: 50, valorUnitario: 1.2 }
        ],
        estado: 'Pendiente'
      },
      {
        solicitante: 'Sofía Ramírez',
        area: 'Bienestar',
        fechaSolicitud: '06/11/2026',
        fechaRequerida: '12/11/2026',
        justificacion: 'Implementos deportivos para jornada recreativa',
        prioridad: 'Baja',
        articulos: [
          { descripcion: 'Balones', cantidad: 10, valorUnitario: 40 },
          { descripcion: 'Conos', cantidad: 20, valorUnitario: 5 }
        ],
        estado: 'Rechazado'
      },
      {
        solicitante: 'Andrés Castro',
        area: 'Sistemas',
        fechaSolicitud: '07/11/2026',
        fechaRequerida: '13/11/2026',
        justificacion: 'Monitores para área de soporte técnico',
        prioridad: 'Media',
        articulos: [
          { descripcion: 'Monitor 24 pulgadas', cantidad: 6, valorUnitario: 350 }
        ],
        estado: 'Pendiente'
      },
      {
        solicitante: 'Valeria León',
        area: 'Contabilidad',
        fechaSolicitud: '08/11/2026',
        fechaRequerida: '14/11/2026',
        justificacion: 'Software de nómina anual',
        prioridad: 'Alta',
        articulos: [
          { descripcion: 'Licencia nómina', cantidad: 1, valorUnitario: 2500 }
        ],
        estado: 'Aprobado'
      },
      {
        solicitante: 'Diego Mora',
        area: 'Logística',
        fechaSolicitud: '09/11/2026',
        fechaRequerida: '15/11/2026',
        justificacion: 'Transporte para entrega de equipos',
        prioridad: 'Media',
        articulos: [
          { descripcion: 'Flete', cantidad: 1, valorUnitario: 180 }
        ],
        estado: 'Rechazado'
      },
      {
        solicitante: 'Lucía Méndez',
        area: 'Sistemas',
        fechaSolicitud: '10/11/2026',
        fechaRequerida: '16/11/2026',
        justificacion: 'UPS para servidores principales',
        prioridad: 'Alta',
        articulos: [
          { descripcion: 'UPS 1500VA', cantidad: 3, valorUnitario: 450 }
        ],
        estado: 'Pendiente'
      }
    ];

    semilla.forEach((r, i) => {
      const id = i + 1;
      this.#requisiciones.update(lista => [...lista, { ...r, id, estado: r.estado }]);
    });
  }

  agregar(requisicion: Omit<Requisicion, 'id' | 'estado'>) {
    const ids = this.#requisiciones().map(r => r.id);
    const id = ids.length ? Math.max(...ids) + 1 : 1;
    const nueva: Requisicion = { ...requisicion, id, estado: 'Pendiente' };
    this.#requisiciones.update(lista => [...lista, nueva]);
  }

  cambiarEstado(id: number, nuevoEstado: 'Aprobado' | 'Rechazado' | 'Pendiente') {
    this.#requisiciones.update(lista => lista.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
  }

  eliminar(id: number) {
    this.#requisiciones.update(lista => lista.filter(r => r.id !== id));
  }

  buscar(texto: string): Observable<Requisicion[]> {
    const recortado = texto.trim();
    if (recortado.length < 2) {
      return of([]);
    }

    const termino = normalizar(recortado);
    const retardo = Math.max(150, 1500 - 300 * recortado.length);

    this.#llamadas.update(l => l + 1);

    const resultado = this.#requisiciones().filter(r => {
      const campos = [
        r.solicitante,
        r.area,
        r.justificacion,
        r.prioridad,
        ...r.articulos.map(a => a.descripcion)
      ];
      return campos.some(c => normalizar(c).includes(termino));
    });

    return of(resultado).pipe(delay(retardo));
  }
}
