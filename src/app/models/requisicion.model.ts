export interface Articulo {
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
}

export type EstadoRequisicion = 'Pendiente' | 'Aprobado' | 'Rechazado';

export interface Requisicion {
  id: string;
  solicitante: string;
  area: string;
  fechaSolicitud: string;
  fechaRequerida: string;
  justificacion: string;
  prioridad: string;
  articulos: Articulo[];
  estado: EstadoRequisicion;
}
