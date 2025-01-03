import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomEmailValidator } from '../../../shared/validators/custom-email.validator';
import { CustomPasswordValidator } from '../../../shared/validators/custom-password.validator';
import { Router, RouterLink } from '@angular/router';
import { ModalForgotPasswordComponent } from '../modal-forgot-password/modal-forgot-password.component';
import { LoginService } from '../../../services/login/login.service';
import { LoginData } from '../../../shared/types/login-data.type';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { LoadingService } from '../../../services/loading/loading.service';
import { finalize } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterLink,
    LoadingComponent,
  ],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss',
})
export class LoginLayoutComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, CustomEmailValidator]),
    password: new FormControl('', [
      Validators.required,
      CustomPasswordValidator,
    ]),
    rememberMe: new FormControl(false),
  });

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loginService: LoginService,
    private toastr: ToastrService,
    private loading: LoadingService,
    private cookieService: CookieService
  ) {}

  openModalForgotPassword(): void {
    const dialogRef = this.dialog.open(ModalForgotPasswordComponent, {
      data: { email: this.loginForm.controls['email'].getRawValue() },
      width: '300px',
    });
  }

  login(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    const data: LoginData = {
      email: this.loginForm.controls['email'].getRawValue()!,
      password: this.loginForm.controls['password'].getRawValue()!,
      rememberMe: this.loginForm.controls['rememberMe'].getRawValue()!,
    };

    this.loading.on();

    this.loginService
      .login(data)
      .pipe(finalize(() => this.loading.off()))
      .subscribe({
        next: () => {
          this.saveAuthentication(data.rememberMe);
        },
        error: (err: FirebaseError) => {
          this.toastr.error(`Erro inesperado: ${err.message}.Tente novamente mais tarde.`);
        }
      });
    }

    saveAuthentication(rememberMe: boolean) {
      this.loginService.firebaseAuth.currentUser?.getIdToken(rememberMe).then(res => {
        const user = this.loginService.firebaseAuth.currentUser;
        const userData = {
          displayName: user?.displayName,
          email: user?.email
        };


        if (!rememberMe) {
          const date: Date = new Date();
          date.setHours(date.getHours() + 1);
          this.cookieService.set('auth_token', res, {expires: date});
          this.cookieService.set('user_data', JSON.stringify(userData), {expires: date});
        } else {
          this.cookieService.set('auth_token', res, {expires: 30});
          this.cookieService.set('user_data', JSON.stringify(userData), {expires: 30});
        }

        this.toastr.success('Login realizado com sucesso.');
        this.router.navigate(['/home']);
    })
  }
}
