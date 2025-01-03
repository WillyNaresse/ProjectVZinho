import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    @if (isLoading) {
      <div class="overlay">
        <mat-progress-spinner
          class="spinner"
          [diameter]="50"
          [strokeWidth]="5"
          mode="indeterminate"
          color="primary"
        ></mat-progress-spinner>
      </div>
    }
  `,
  styles: `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .spinner {
      z-index: 1001;
    }
  `
})
export class LoadingComponent {
  isLoading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }
}
