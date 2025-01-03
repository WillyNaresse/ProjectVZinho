import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ModalForgotPasswordComponent } from '../../login-signup/modal-forgot-password/modal-forgot-password.component';
import { ChecklistData } from '../../../shared/types/checklist-data.type';

interface checklistData {
  item: ChecklistData
}

@Component({
  selector: 'app-modal-delete-checklist',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './modal-delete-checklist.component.html',
  styleUrl: './modal-delete-checklist.component.scss'
})
export class ModalDeleteChecklistComponent {

  constructor(protected dialogRef: MatDialogRef<ModalForgotPasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: checklistData) {}

}
