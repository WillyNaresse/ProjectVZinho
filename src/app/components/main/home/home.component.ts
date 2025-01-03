import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatButtonModule } from '@angular/material/button';
import { ChecklistCardComponent } from '../checklist-card/checklist-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ChecklistService } from '../../../services/checklist/checklist.service';
import { LoadingService } from '../../../services/loading/loading.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, ChecklistCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  checklists: any;
  today: Date = new Date;

  cookieService = inject(CookieService);
  user = JSON.parse(this.cookieService.get('user_data'))

  constructor(private loading: LoadingService, private loginService: LoginService, private toastr: ToastrService, private router: Router, private checkService: ChecklistService) {}

  ngOnInit(): void {
    this.loading.on();

    this.checkService.getChecklists().subscribe({
      next: (res) => {
        this.checkService.checklistData$.set(res);

        this.checklists = res;

        this.checklists.map((item: any) => {
          if (item.limitDate) {
            item.limitDate = new Date(item?.limitDate?.seconds * 1000);
          }

          if (item.setLimitDate && !item.setColor) {
            const timeDifference = item.limitDate.getTime() - this.today.getTime();

            if (timeDifference <= 0) {
              item.backgroundColor = '#d82626';
              item.borderShadowColor = '#474747';
              item.textColor = '#ffffff';
            } else if (timeDifference < (2 * 24 * 60 * 60 * 1000)) {
              item.backgroundColor = '#ffbb00bf';
              item.borderShadowColor = '#474747';
              item.textColor = '#333333';
            } else {
              item.backgroundColor = '#ffffffbf';
              item.borderShadowColor = '#00adff';
              item.textColor = '#333333';
            }
          }
        })

        this.loading.off();
      },
      error: (err) => {
        console.error(err);
        this.loading.off();
      }
    })
  }
}
