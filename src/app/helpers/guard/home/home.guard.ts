import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const homeGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService);
  const router = inject(Router);

  const token = cookieService.get('auth_token');
  const userData = cookieService.get('user_data');

  if (token && userData) {
    router.navigate(['home']);
    return false;
  } else {
    return true;
  }};
