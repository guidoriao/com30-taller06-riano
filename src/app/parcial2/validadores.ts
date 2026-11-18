import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function multiploDe(m: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = Number(control.value);
    if (control.value === null || control.value === '' || isNaN(val)) {
      return null;
    }
    return val % m === 0 ? null : { multiplo: { requerido: m, actual: val } };
  };
}

export const rangoFechasValido: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const desde = group.get('desde')?.value;
  const hasta = group.get('hasta')?.value;

  if (desde === null || hasta === null || desde === '' || hasta === '') {
    return null;
  }

  return Number(hasta) > Number(desde) ? null : { hastaMayor: true };
};