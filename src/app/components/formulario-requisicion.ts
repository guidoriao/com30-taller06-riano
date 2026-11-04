import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { RequisicionService } from '../services/requisicion.service';
import { noSoloEspaciosValidator, fechaRangoValidator, minimoItemsValidator } from '../validators/custom-validators';

interface ArticuloForm {
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
}

@Component({
  standalone: true,
  selector: 'app-formulario-requisicion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-requisicion.html',
  styleUrl: './formulario-requisicion.css'
})
export class FormularioRequisicionComponent {
  private fb = inject(FormBuilder);
  private requisicionService = inject(RequisicionService);

  form = this.fb.nonNullable.group({
    solicitante: ['', [Validators.required, Validators.minLength(3), noSoloEspaciosValidator()]],
    area: ['', [Validators.required, Validators.minLength(3), noSoloEspaciosValidator()]],
    fechaSolicitud: ['', [Validators.required]],
    fechaRequerida: ['', [Validators.required]],
    justificacion: ['', [Validators.required, Validators.minLength(10), noSoloEspaciosValidator()]],
    prioridad: ['', [Validators.required]],
    articulos: this.fb.nonNullable.array<ArticuloForm>([], [minimoItemsValidator(1)])
  }, { validators: [fechaRangoValidator()] });

  get articulos(): FormArray {
    return this.form.controls.articulos as FormArray;
  }

  agregarArticulo() {
    const grupo: FormGroup = this.fb.nonNullable.group({
      descripcion: ['', [Validators.required, noSoloEspaciosValidator()]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: [0, [Validators.required, Validators.min(0)]]
    });
    this.articulos.push(grupo);
  }

  quitarArticulo(index: number) {
    this.articulos.removeAt(index);
  }

  enviar() {
    if (this.form.invalid) {
      return;
    }
    const valor = this.form.getRawValue();
    const requisicion = {
      solicitante: valor.solicitante,
      area: valor.area,
      fechaSolicitud: valor.fechaSolicitud,
      fechaRequerida: valor.fechaRequerida,
      justificacion: valor.justificacion,
      prioridad: valor.prioridad,
      articulos: valor.articulos
    };
    this.requisicionService.agregar(requisicion);
    this.form.reset({
      solicitante: '',
      area: '',
      fechaSolicitud: '',
      fechaRequerida: '',
      justificacion: '',
      prioridad: '',
      articulos: []
    });
    while (this.articulos.length) {
      this.articulos.removeAt(0);
    }
    this.agregarArticulo();
  }
}
