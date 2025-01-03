import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ChecklistService } from '../../../services/checklist/checklist.service';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDeleteChecklistComponent } from '../modal-delete-checklist/modal-delete-checklist.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-checklist-card',
  standalone: true,
  imports: [ MatCardModule, MatButtonModule, MatIconModule, RouterLink, DatePipe, MatDialogModule ],
  templateUrl: './checklist-card.component.html',
  styleUrl: './checklist-card.component.scss',
})
export class ChecklistCardComponent {

  @Input() item:any = null;
  @Input() index!: number;

  constructor(private dialog: MatDialog, private toastr: ToastrService, private checkService: ChecklistService, private loading: LoadingService) {}

  openModalConfirmDeletion(): void {
    const dialogRef = this.dialog.open(ModalDeleteChecklistComponent, {
      data: { item: this.item },
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteChecklist(this.item.id);
      }
    });
  }

  deleteChecklist(id: string) {
    this.loading.on();

    this.checkService.deleteChecklist(id).pipe(finalize(() => this.loading.off())).subscribe({
      next: () => {
        this.toastr.success('Checklist deletada com sucesso.');
        this.checkService.getChecklists().subscribe();
      },
      error(err) {
        console.error(err);
      },
    });
  }
}
