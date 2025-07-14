import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PaymentsTableComponent } from '../payments/payments-table/payments-table.component';
import { PaymentService } from '../payments/payment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PaymentsTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

 
}
