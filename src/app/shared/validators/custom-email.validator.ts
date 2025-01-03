// src/app/shared/validators/custom-email.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CustomEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9-]{3,}\.(com|br)$/;

  return emailRegex.test(value) ? null : { invalidEmail: true };
};
