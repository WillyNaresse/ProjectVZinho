import { Component, Inject } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { LoadingService } from '../../../../services/loading/loading.service';
import { LoginService } from '../../../../services/login/login.service';
import { LoadingComponent } from '../../../../shared/loading/loading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [LoadingComponent, MatButtonModule, MatIconModule, MatInputModule, NgxMaskDirective, DatePipe, NgxMaskPipe, MatFormFieldModule, MatNativeDateModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  providers: [
    ApiService,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class EditProfileComponent {

  userData: any;
  minDate: Date;
  maxDate: Date;

  userDataForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    birthDate: new FormControl(null, [Validators.required]),
    cep: new FormControl(null),
    uf: new FormControl(''),
    city: new FormControl(''),
    address: new FormControl(''),
    addressNumber: new FormControl(null),
  });

  constructor(private location: Location, private router: Router, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private loginService: LoginService, private apiService: ApiService, private loading: LoadingService, private toastr: ToastrService) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minDate = new Date(currentYear - 117, 0, 1);
    this.maxDate = new Date(currentYear - 16, currentMonth, currentDay);
  }

  ngOnInit(): void {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

    this.loading.on();

    this.loginService.getUserData().subscribe({
      next: (res: any) => {
        this.userData = res[0];
        this.userData.birthDate = new Date(this.userData?.birthDate?.seconds * 1000);

        this.applyData(this.userData);

        this.loading.off();
      },
      error: (err) => {
        console.error(err);
        this.loading.off();
      }
    })
  }

  applyData(data: any) {
    this.userDataForm.controls['name'].setValue(data?.name);
    this.userDataForm.controls['birthDate'].setValue(data?.birthDate);
    this.userDataForm.controls['cep'].setValue(data?.cep);
    this.userDataForm.controls['uf'].setValue(data?.uf);
    this.userDataForm.controls['city'].setValue(data?.city);
    this.userDataForm.controls['address'].setValue(data?.address);
    this.userDataForm.controls['addressNumber'].setValue(data?.addressNumber);
  }

  loadAddressData() {
    const cep: any = this.userDataForm.controls['cep'].getRawValue();

    if (cep?.length < 8) return;

    this.loading.on();

    this.apiService.getAddressByCep(cep!).pipe(finalize(() => this.loading.off())).subscribe({
      next: (data: any) => {
        this.userDataForm.controls['uf'].setValue(data.uf);
        this.userDataForm.controls['city'].setValue(data.localidade);
        this.userDataForm.controls['address'].setValue(data.logradouro);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  editUserData() {
    this.userDataForm.markAllAsTouched();

    if (this.userDataForm.invalid) return;

    const edittedUser = this.userDataForm.getRawValue();

    Object.assign(this.userData, edittedUser);

    this.loginService.editUserData(this.userData.id, this.userData).subscribe({
      next: () => {
        this.toastr.success('Conta editada com sucesso.');
        this.router.navigate(['home/about/profile']);
      },
      error: (err) => this.toastr.error(`Erro inesperado: ${err.message}.Tente novamente mais tarde.`),
    })
  }

  return() {
    this.location.back();
  }
}
