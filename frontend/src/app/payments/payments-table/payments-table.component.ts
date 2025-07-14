import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';

import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatOptionModule,
  ],
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.css'],
})
export class PaymentsTableComponent implements OnInit {
  displayedColumns = [
    'date',
    'cashPaid',
    'waterUnits',
    'serviceFee',
    'vehicleInfo',
    'balance',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>([]);
  allPayments: any[] = [];
  filterType = 'weekly';
  vehicles: any[] = [];
  editData: any = null;
  pageSize = 7;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editDialog') editDialogRef!: TemplateRef<any>;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.fetchVehicles();
    this.fetchPayments();
  }

  fetchPayments(): void {
    this.paymentService.getAllPayments().subscribe((data) => {
      this.allPayments = data;
      this.applyFilter();
    });
  }

  fetchVehicles(): void {
    this.http.get<any[]>('/api/vehicles').subscribe((data) => {
      this.vehicles = data;
    });
  }

  applyFilter(): void {
    const now = new Date();
    const from = new Date();

    if (this.filterType === 'weekly') from.setDate(now.getDate() - 7);
    else if (this.filterType === 'monthly') from.setMonth(now.getMonth() - 1);
    else if (this.filterType === 'yearly')
      from.setFullYear(now.getFullYear() - 1);

    const filtered = this.allPayments.filter((p) => new Date(p.date) >= from);

    this.dataSource = new MatTableDataSource(filtered);
    this.dataSource.paginator = this.paginator;
  }

  openEditDialog(payment: any): void {
    this.editData = {
      _id: payment._id,
      cashPaid: payment.cashPaid,
      waterUnits: payment.waterUnits,
      services: payment.services.map((s: any) => ({
        vehicle: s.vehicle?._id || s.vehicle,
        serviceFee: s.serviceFee,
      })),
    };
    this.dialog.open(this.editDialogRef);
  }

  addService(): void {
    this.editData.services.push({ vehicle: '', serviceFee: 0 });
  }

  removeService(i: number): void {
    this.editData.services.splice(i, 1);
  }

  saveEdit(): void {
    const payload = {
      cashPaid: this.editData.cashPaid,
      waterUnits: this.editData.waterUnits,
      services: this.editData.services.map((s: any) => ({
        vehicle: s.vehicle,
        serviceFee: s.serviceFee,
      })),
    };
    this.paymentService.updatePayment(this.editData._id, payload).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.fetchPayments();
      },
      error: (err) =>
        alert('Failed to update: ' + (err.error?.message || 'Server error')),
    });
  }

  deletePayment(id: string): void {
    if (confirm('Are you sure?')) {
      this.paymentService
        .deletePayment(id)
        .subscribe(() => this.fetchPayments());
    }
  }

  getTotalServiceFee(s: any[]): number {
    return (s || []).reduce((t, svc) => t + (svc.serviceFee || 0), 0);
  }
}
