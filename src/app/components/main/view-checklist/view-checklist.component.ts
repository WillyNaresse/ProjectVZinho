import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChecklistService } from '../../../services/checklist/checklist.service';
import { ChecklistData } from '../../../shared/types/checklist-data.type';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Message {
  id: number,
  autor: string,
  frase: string
}

@Component({
  selector: 'app-view-checklist',
  standalone: true,
  imports: [DatePipe, MatIconModule, MatButtonModule, MatInputModule, MatCheckboxModule, MatDatepickerModule, CdkDropList, CdkDrag, CdkDragHandle, MatNativeDateModule, ReactiveFormsModule],
  templateUrl: './view-checklist.component.html',
  styleUrl: './view-checklist.component.scss',
})
export class ViewChecklistComponent implements OnInit {

  checklist: any;
  motivMessage!: Message;

  today: Date = new Date();

  checklistForm: FormGroup = new FormGroup({
    checklistItems: new FormArray([]),
  });

  constructor(private http: HttpClient, private location: Location, private activatedRoute: ActivatedRoute, private checkService: ChecklistService, private router: Router, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, private fb: FormBuilder, private toastr: ToastrService) {}

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

    if (this.checklist?.setMessage) {
      this.getRandomMessage();
    }
  }

  findChecklist() {
    const id = this.activatedRoute.snapshot.params['id'];

    if (this.checkService?.checklistData$()) {
      const checklist = this.checkService?.checklistData$()?.find((data: ChecklistData) => data.id === id);

      if (checklist?.checklistItems) {
        this.applyChecklistData(checklist.checklistItems);
      } else {
        this.router.navigate(['home']);
      }

      return checklist;
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  getRandomMessage() {
    this.http.get<Message[]>('assets/json/frases.json').subscribe({
      next: (res) => {
        const randomIndex = Math.floor(Math.random() * res.length);
        this.motivMessage = res[randomIndex];
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  applyChecklistData(checklistItems: any[]) {
    const checklistArray = checklistItems.map(item =>
      this.fb.group({
        label: new FormControl(item.label, Validators.required),
        checked: new FormControl(item.checked)
      })
    );

    this.checklistForm.setControl('checklistItems', this.fb.array(checklistArray));
  }

  addItem(): void {
    const newItem = this.fb.group({
      label: new FormControl('', Validators.required),
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

    const checklist = this.checklistForm.getRawValue();
    checklist.id = this.activatedRoute.snapshot.params['id'];

    this.checkService.editChecklistItems(checklist.id, checklist.checklistItems).subscribe({
      next: () => {
        this.toastr.success('Checklist editada com sucesso.');
        this.router.navigate(['home']);
      },
      error: (err) => this.toastr.error(`Erro inesperado: ${err.message}.Tente novamente mais tarde.`),
    })
  }
}
