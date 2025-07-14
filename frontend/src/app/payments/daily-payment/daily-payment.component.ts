import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../payment.service';
import { VehicleSelectorComponent } from '../../vehicles/vehicle-selector/vehicle-selector.component';

@Component({
  selector: 'app-daily-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleSelectorComponent],
  templateUrl: './daily-payment.component.html',
  styleUrls: ['./daily-payment.component.css'],
})
export class DailyPaymentComponent {
  today = new Date().toISOString().split('T')[0];
  waterUnits: number = 1;
  waterCost = 600;

  amountPaid: number = 0;
  selectedVehicle: any = null;
  paymentType: 'cash' | 'wash' = 'cash';

  result: string = '';
  submitting = false;

  constructor(private paymentService: PaymentService) {}

  handleVehicleSelect(vehicle: any) {
    this.selectedVehicle = vehicle;
  }

  submitPayment() {
    this.submitting = true;

    const data: any = {
      date: this.today,
      waterUnits: this.waterUnits,
    };

    if (this.paymentType === 'cash') {
      data.cashPaid = this.amountPaid;
      data.services = [];
    } else if (this.paymentType === 'wash' && this.selectedVehicle) {
      data.cashPaid = 0;
      data.services = [
        {
          vehicle: this.selectedVehicle._id,
          serviceFee: this.waterCost,
        },
      ];
    } else {
      this.result = 'Please select a vehicle for washing.';
      this.submitting = false;
      return;
    }

    this.paymentService.addPayment(data).subscribe({
      next: (res) => {
        this.result = res.message || 'Payment recorded successfully.';
        this.resetForm();
      },
      error: (err) => {
        this.result =
          'Error: ' + (err.error?.message || 'Failed to save payment.');
        this.submitting = false;
      },
    });
  }

  resetForm() {
    this.amountPaid = 0;
    this.selectedVehicle = null;
    this.paymentType = 'cash';
    this.waterUnits = 1;
    this.submitting = false;
  }
}
