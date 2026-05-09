import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export const crossPasswordCustomValidation: ValidatorFn = (
  formGroupControl: AbstractControl<{ password: string; repeatpassword: string }>,
): ValidationErrors | null => {
  const password = formGroupControl.value.password;
  const repeatpassword = formGroupControl.value.repeatpassword;

  return password !== repeatpassword ? { customValidationPassword: true } : null;
};

export class PasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null): boolean {
    if (!control || !control.parent) return false;
    return control.parent.hasError('customValidationPassword');
  }
}
