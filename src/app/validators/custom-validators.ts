import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormArray } from '@angular/forms';

export function noSoloEspaciosValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value ?? '';
    const esSoloEspacios = /^\s*$/.test(valor);
    return esSoloEspacios ? { soloEspacios: true } : null;
  };
}

export function fechaRangoValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const form = group as FormGroup;
    const solicitud = form.get('fechaSolicitud')?.value;
    const requerida = form.get('fechaRequerida')?.value;
    if (!solicitud || !requerida) {
      return null;
    }
    const invalida = new Date(requerida) < new Date(solicitud);
    return invalida ? { rangoFechasInvalido: true } : null;
  };
}

export function minimoItemsValidator(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const array = control as FormArray;
    const count = array.controls.length;
    return count < minimo ? { sinArticulos: true } : null;
  };
}
