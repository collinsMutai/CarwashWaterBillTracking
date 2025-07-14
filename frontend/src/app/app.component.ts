import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { PaymentService } from './payments/payment.service'; // adjust path as needed
import moment from 'moment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  triggerSummary() {
    this.paymentService.triggerManualSummary().subscribe({
      next: (res) => {
        alert(res.message || 'Summary generated!');
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to generate summary.');
      },
    });
  }

  downloadInvoicePdf() {
    const startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');

    this.paymentService.downloadWeeklyInvoice(startDate).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weekly-invoice-${startDate}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('❌ Failed to download PDF:', err);
        alert('Error downloading PDF. Please try again.');
      },
    });
  }
}
