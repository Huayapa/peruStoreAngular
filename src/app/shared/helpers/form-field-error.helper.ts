import { AbstractControl } from '@angular/forms';

export function getFormError(control: AbstractControl | null): string | null {
  if (!control?.errors || !control.touched) return null;

  const { errors } = control;
  const messages: Record<string, string> = {
    required: 'Este campo es requerido',
    minlength: `No debe ser menor a ${control.errors['minlength']?.requiredLength} caracteres`,
    maxlength: `No debe exceder a ${control.errors['maxlength']?.requiredLength} caracteres`,
    email: 'Correo Inválido',
    pattern: 'Formato Inválido',
  };

  return messages[Object.keys(errors)[0]] ?? null;
}
