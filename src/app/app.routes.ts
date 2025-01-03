import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './components/login-signup/login-layout/login-layout.component';
import { SignupLayoutComponent } from './components/login-signup/signup-layout/signup-layout.component';
import { HomeLayoutComponent } from './components/main/home-layout/home-layout.component';
import { authGuard } from './helpers/guard/auth/auth.guard';
import { homeGuard } from './helpers/guard/home/home.guard';
import { HomeComponent } from './components/main/home/home.component';
import { NewChecklistComponent } from './components/main/new-checklist/new-checklist.component';
import { EditChecklistComponent } from './components/main/edit-checklist/edit-checklist.component';
import { ViewChecklistComponent } from './components/main/view-checklist/view-checklist.component';
import { ProfileComponent } from './components/main/about/profile/profile.component';
import { ContactsComponent } from './components/main/about/contacts/contacts.component';
import { EditProfileComponent } from './components/main/about/edit-profile/edit-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    canActivate: [homeGuard]
  },
  {
    path: 'signup',
    component: SignupLayoutComponent,
    canActivate: [homeGuard]
  },
  {
    path: 'home',
    component: HomeLayoutComponent,
    canActivateChild: [authGuard],
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'new',
        component: NewChecklistComponent
      },
      {
        path: ':id',
        component: ViewChecklistComponent
      },
      {
        path: 'edit/:id',
        component: EditChecklistComponent
      },
      {
        path: 'about',
        children: [
          {
            path: 'profile',
            component: ProfileComponent
          },
          {
            path: 'profile/edit',
            component: EditProfileComponent
          },
          {
            path: 'contact',
            component: ContactsComponent
          },
        ]
      },
    ]
  },
];
