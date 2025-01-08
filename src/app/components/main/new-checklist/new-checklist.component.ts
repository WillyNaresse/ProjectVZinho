import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, CdkDragHandle} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChecklistService } from '../../../services/checklist/checklist.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-new-checklist',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, MatButtonModule, MatInputModule, MatCheckboxModule, MatDatepickerModule, CdkDropList, CdkDrag, CdkDragHandle, MatNativeDateModule, ReactiveFormsModule],
  templateUrl: './new-checklist.component.html',
  styleUrl: './new-checklist.component.scss',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ]
})
export class NewChecklistComponent implements OnInit {

  today: Date = new Date();

  checklistForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    setLimitDate: new FormControl(false),
    setColor: new FormControl(false),
    setMessage: new FormControl(false),
    limitDate: new FormControl(null),
    backgroundColor: new FormControl('#ffffff'),
    borderShadowColor: new FormControl('#00adff'),
    textColor: new FormControl('#333333'),
    checklistItems: new FormArray([
      new FormGroup({
        label: new FormControl(''),
        checked: new FormControl(false)
      }),
    ]),
  })

  constructor(private location: Location, private loading: LoadingService, private checkService: ChecklistService, private router: Router, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private fb: FormBuilder, private toastr: ToastrService) {}

  get items(): FormArray {
    return this.checklistForm.get('checklistItems') as FormArray;
  }

  return() {
    this.location.back();
  }

  ngOnInit() {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);
  }

  resetValues(formControl: string) {
    if (!this.checklistForm.controls[formControl].value) {
      if (formControl === 'setLimitDate') {
        this.checklistForm.controls['limitDate'].reset();
      } else if (formControl === 'setColor') {
        this.checklistForm.controls['backgroundColor'].reset('#ffffff');
        this.checklistForm.controls['borderShadowColor'].reset('#00adff');
        this.checklistForm.controls['textColor'].reset('#333333');
      }
    }
  }

  addItem(): void {
    const newItem = new FormGroup({
      label: new FormControl(''),
      checked: new FormControl(false)
    });
    this.items.push(newItem);
  }

  removeItem(index: number): void {
    if (index === 0 && this.items.length === 1) {
      return;
    }

    this.items.removeAt(index);

    const currentControls = this.items.controls.map(control => control.value);
    this.checklistForm.setControl('checklistItems', this.fb.array(
      currentControls.map(item =>
        this.fb.group({
          label: item.label,
          checked: item.checked
        })
      )
    ));
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items.controls, event.previousIndex, event.currentIndex);

    const updatedControls = this.items.controls.map(control => control.value);
    this.checklistForm.setControl('checklistItems', this.fb.array(
      updatedControls.map(item =>
        this.fb.group({
          label: item.label,
          checked: item.checked
        })
      )
    ));
  }

  saveChecklist() {
    this.checklistForm.markAllAsTouched();

    if (this.checklistForm.invalid) return;

    const firstLine = this.items.controls[0].getRawValue();
    if (firstLine.label === '' && this.items.controls.length === 1) {
      this.toastr.warning('Atenção: Você deve adicionar ao menos um item na lista!');

      return;
    };

    this.loading.on();

    const checklist = this.checklistForm.getRawValue();

    this.checkService.addChecklistToCollection(checklist)
    .pipe(finalize(() => this.loading.off()))
    .subscribe({
      next: (res) => {
        this.toastr.success('Checklist criada com sucesso.');
        this.router.navigate(['home']);
      },
      error: (err) => this.toastr.error(`Erro inesperado: ${err.message}.Tente novamente mais tarde.`),
    })
  }
}
