import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomEmailValidator } from '../../../shared/validators/custom-email.validator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../../../services/loading/loading.service';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { LoginService } from '../../../services/login/login.service';
import { FirebaseError } from '@angular/fire/app';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface ForgotPasswordDialogData {
  email: string | null;
}

@Component({
  selector: 'app-modal-forgot-password',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './modal-forgot-password.component.html',
  styleUrl: './modal-forgot-password.component.scss'
})
export class ModalForgotPasswordComponent implements OnInit {

  email: FormControl = new FormControl('', [Validators.required, CustomEmailValidator])

  constructor(private toastr: ToastrService, private loginService: LoginService, protected dialogRef: MatDialogRef<ModalForgotPasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: ForgotPasswordDialogData, private loading: LoadingService){}

  ngOnInit(): void {
      this.email.setValue(this.data.email);
      this.email.markAsPristine();
  }

  sendPasswordChangeRequest(e: Event) {
    e.preventDefault();
    this.email.markAsTouched();

    if (this.email.invalid) return;

    this.loading.on();

    this.loginService
      .resetPassword(this.email.getRawValue())
      .pipe(finalize(() => this.loading.off()))
      .subscribe({
        next: () => {
          this.toastr.info('Redefinição de senha enviada. Verifique seu e-mail.');
          this.dialogRef.close();
        },
        error: (err: FirebaseError) => {
          this.toastr.error(`Erro inesperado: ${err.message}.Tente novamente mais tarde.`);
        }
      });
  }
}
