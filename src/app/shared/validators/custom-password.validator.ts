// src/app/shared/validators/custom-password.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const CustomPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
 const value = control.value;

 if (!value) {
   return null;
 }

 const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

 return passwordRegex.test(value) ? null : { invalidPassword: true };
};
