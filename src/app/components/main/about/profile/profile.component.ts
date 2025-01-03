import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../../../services/login/login.service';
import { LoadingService } from '../../../../services/loading/loading.service';
import { LoadingComponent } from '../../../../shared/loading/loading.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, LoadingComponent, DatePipe, NgxMaskDirective, NgxMaskPipe, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  userData: any;

  constructor(private location: Location, private loginService: LoginService, private loading: LoadingService) {}

  ngOnInit(): void {
    this.loading.on();

    this.loginService.getUserData().subscribe({
      next: (res: any) => {
        this.userData = res[0];
        this.userData.birthDate = new Date(this.userData?.birthDate?.seconds * 1000);
        this.loading.off();
      },
      error: (err) => {
        console.error(err);
        this.loading.off();
      }
    })
  }

  return() {
    this.location.back();
  }
}
