import { Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'app', component: MainLayoutComponent,
    children: [
      { path: 'landing', component: LandingComponent },
      { path: 'account', component: AccountComponent },
      { path: '', redirectTo: 'landing', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
