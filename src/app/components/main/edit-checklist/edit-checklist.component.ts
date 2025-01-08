import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChecklistService } from '../../../services/checklist/checklist.service';
import { ChecklistData } from '../../../shared/types/checklist-data.type';

@Component({
  selector: 'app-edit-checklist',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatInputModule, MatCheckboxModule, MatDatepickerModule, CdkDropList, CdkDrag, CdkDragHandle, MatNativeDateModule, ReactiveFormsModule],
  templateUrl: './edit-checklist.component.html',
  styleUrl: './edit-checklist.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ]
})
export class EditChecklistComponent implements OnInit {

  checklist: any;

  today: Date = new Date();

  checklistForm: FormGroup;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private checkService: ChecklistService,
    private router: Router,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.checklistForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      setLimitDate: [false],
      setColor: [false],
      setMessage: [false],
      limitDate: [null],
      backgroundColor: ['#ffffff'],
      borderShadowColor: ['#00adff'],
      textColor: ['#333333'],
      checklistItems: this.fb.array([]),
    });
  }

  get items(): FormArray {
    return this.checklistForm.get('checklistItems') as FormArray;
  }

  return() {
    this.location.back();
  }

  ngOnInit() {
    this._locale = 'pt-BR';
    this._adapter.setLocale(this._locale);

    this.checklist = this.findChecklist();
  }

  findChecklist() {
    const id = this.activatedRoute.snapshot.params['id'];

    if (this.checkService?.checklistData$()) {
      const checklist = this.checkService?.checklistData$()?.find((data: ChecklistData) => data.id === id);

      this.applyChecklistData(checklist);

      return checklist;
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  applyChecklistData(checklist: any) {
    if (!checklist) return;

    const list = { ...checklist };

    delete list.userUid;

    const checklistItemsFormArray = this.fb.array(
      list.checklistItems.map((item: any) =>
        this.fb.group({
          label: [item.label],
          checked: [item.checked]
        })
      )
    );

    this.checklistForm.setControl('checklistItems', checklistItemsFormArray);

    this.checklistForm.patchValue(list);
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
    const newItem = this.fb.group({
      label: [''],
      checked: [false]
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

    const updatedItems = this.items.controls.map(control => control.value);
    this.checklistForm.setControl(
      'checklistItems',
      this.fb.array(
        updatedItems.map(item =>
          this.fb.group({
            label: [item.label, Validators.required],
            checked: [item.checked]
          })
        )
      )
    );
  }

  saveChecklist() {
    this.checklistForm.markAllAsTouched();

    if (this.checklistForm.invalid) return;

    const firstLine = this.items.controls[0].getRawValue();
    if (firstLine.label === '' && this.items.controls.length === 1) {
      this.toastr.warning('Atenção: Você deve adicionar ao menos um item na lista!');

      return;
    }

    const checklist = this.checklistForm.getRawValue();
    checklist.id = this.activatedRoute.snapshot.params['id'];

    this.checkService.editChecklist(checklist.id, checklist).subscribe({
      next: () => {
        this.toastr.success('Checklist editada com sucesso.');
        this.router.navigate(['home']);
      },
      error: (err) => this.toastr.error(`Erro inesperado: ${err.message}.Tente novamente mais tarde.`),
    })
  }
}
