import { Routes } from '@angular/router';
import { AccountComponent } from '@app/components/account/account.component';
import { LoginComponent } from '@app/components/login/login.component';
import { LandingComponent } from '@app/pages/landing/landing.component';
import { MainLayoutComponent } from '@app/pages/main-layout/main-layout.component';
import { UpdateAccountComponent } from '@app/components/update-account/update-account.component';
import { CreateAccountComponent } from '@app/components/create-account/create-account.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      { path: 'landing', component: LandingComponent },
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'account/create',
        component: CreateAccountComponent,
      },
      {
        path: 'account/update/:id',
        component: UpdateAccountComponent,
      },
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
