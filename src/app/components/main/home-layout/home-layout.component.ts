import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { sendEmailVerification, User } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../../services/loading/loading.service';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [LoadingComponent, MatButtonModule, MatIconModule, MatSidenavModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  user!: User;
  showVerificationMessage: boolean | null = null;

  constructor(private cookieService: CookieService, private router: Router, private loginService: LoginService, private toastr: ToastrService, private loading: LoadingService) {}

  ngOnInit(): void {
    this.loading.on();

    this.loginService.user$.subscribe((user: User) => {
      this.loginService.userData$.set(user);
      this.user = user;

      if (!this.user?.emailVerified) {
        this.showVerificationMessage = true;
      } else {
        this.showVerificationMessage = false;
      }

      this.loading.off();
    })
  }

  resendVerificationEmail() {
    this.loading.on();
    sendEmailVerification(this.user).finally(() => this.loading.off());
    this.toastr.info(`E-mail de verificação enviado.`);
  }

  logout() {
    this.sidenav.close();
    this.loginService.logout();
    this.cookieService.delete('auth_token');
    this.toastr.info('Logout realizado com sucesso.');
    this.router.navigate(['/']);
  }
}
