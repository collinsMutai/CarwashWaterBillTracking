import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { VehicleSelectorComponent } from './vehicles/vehicle-selector/vehicle-selector.component';
import { DailyPaymentComponent } from './payments/daily-payment/daily-payment.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard], // default route goes to Dashboard, requires login
  },
  {
    path: 'login',
    component: LoginComponent, // login is public, guard handles redirection
  },
  {
    path: 'vehicles',
    component: VehicleSelectorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    component: DailyPaymentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '', // fallback to dashboard (or login via guard)
  },
];
