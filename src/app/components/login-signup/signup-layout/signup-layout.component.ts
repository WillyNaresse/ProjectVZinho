import { Component, Inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomEmailValidator } from '../../../shared/validators/custom-email.validator';
import { CustomPasswordValidator } from '../../../shared/validators/custom-password.validator';
import { Router, RouterLink } from '@angular/router';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ApiService } from '../../../services/api/api.service';
import { HttpClientModule } from '@angular/common/http';
import { SignupData } from '../../../shared/types/signup-data.type';
import { LoadingService } from '../../../services/loading/loading.service';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { LoginService } from '../../../services/login/login.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FirebaseError } from '@angular/fire/app';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalTermsOfUseComponent } from '../modal-terms-of-use/modal-terms-of-use.component';

@Component({
  selector: 'app-signup-layout',
  standalone: true,
  imports: [
    HttpClientModule,
    MatDialogModule,
    NgxMaskDirective,
    NgxMaskPipe,
    LoadingComponent,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './signup-layout.component.html',
  styleUrl: './signup-layout.component.scss',
  providers: [ApiService, { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class SignupLayoutComponent implements OnInit {
  passwordMatchErr: boolean = false;
  minDate: Date;
  maxDate: Date;

  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    birthDate: new FormControl(null, [Validators.required]),
    cep: new FormControl(null),
    uf: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
    addressNumber: new FormControl(null),
    email: new FormControl('', [Validators.required, CustomEmailValidator]),
    password: new FormControl('', [
      Validators.required,
      CustomPasswordValidator,
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      CustomPasswordValidator,
    ]),
    dataAgreement: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private loginService: LoginService,
    private apiService: ApiService,
    private loading: LoadingService,
    private toastr: ToastrService
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minDate = new Date(currentYear - 117, 0, 1);
    this.maxDate = new Date(currentYear - 16, currentMonth, currentDay);
  }

  ngOnInit() {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
  }

  openModalTermsOfUse(): void {
    const dialogRef = this.dialog.open(ModalTermsOfUseComponent, {
      minWidth: '300px',
      maxWidth: '800px',
    });
  }

  loadAddressData() {
    const cep: any = this.signupForm.controls['cep'].getRawValue();

    if (cep?.length < 8) return;

    this.loading.on();

    this.apiService.getAddressByCep(cep!).pipe(finalize(() => this.loading.off())).subscribe({
      next: (data) => {
        this.signupForm.controls['uf'].setValue(data.uf);
        this.signupForm.controls['city'].setValue(data.localidade);
        this.signupForm.controls['address'].setValue(data.logradouro);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  signup() {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) return;

    if (
      this.signupForm.controls['password'].getRawValue() !==
      this.signupForm.controls['passwordConfirm'].getRawValue()
    ) {
      this.toastr.error(
        'As senhas não coincidem. Verifique e tente novamente.'
      );
      return;
    }

    const data: SignupData = {
      email: this.signupForm.controls['email'].getRawValue()!,
      password: this.signupForm.controls['password'].getRawValue()!,
      passwordConfirm:
        this.signupForm.controls['passwordConfirm'].getRawValue()!,
      dataAgreement: this.signupForm.controls['dataAgreement'].getRawValue()!,
      name: this.signupForm.controls['name'].getRawValue(),
      birthDate: this.signupForm.controls['birthDate'].getRawValue()!,
      cep: this.signupForm.controls['cep']?.getRawValue()!,
      uf: this.signupForm.controls['uf']?.getRawValue()!,
      city: this.signupForm.controls['city']?.getRawValue()!,
      address: this.signupForm.controls['address'].getRawValue()!,
      addressNumber: this.signupForm.controls['addressNumber'].getRawValue()!,
    };

    this.loading.on();

    this.loginService
      .signup(data)
      .pipe(finalize(() => this.loading.off()))
      .subscribe({
        next: () => {
          this.toastr.success('Cadastro realizado com sucesso.');
          this.router.navigate(['/']);
        },
        error: (err: FirebaseError) => {
          this.toastr.error(
            `Erro inesperado: ${err.message}.Tente novamente mais tarde.`
          );
        },
      });
  }
}
