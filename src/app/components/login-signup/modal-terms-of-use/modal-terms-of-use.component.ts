import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-terms-of-use',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './modal-terms-of-use.component.html',
  styleUrl: './modal-terms-of-use.component.scss'
})
export class ModalTermsOfUseComponent {

  constructor(protected dialogRef: MatDialogRef<ModalTermsOfUseComponent>) {}

}
