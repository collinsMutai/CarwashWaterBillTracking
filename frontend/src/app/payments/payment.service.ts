import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = '/api/payments';

  constructor(private http: HttpClient) {}

  addPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, paymentData);
  }

  getPaymentsByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?date=${date}`);
  }

  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ✅ New: Update existing payment
  updatePayment(id: string, paymentData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, paymentData);
  }

  // ✅ Optional: Delete payment if needed
  deletePayment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // ✅ Trigger weekly summary manually
  triggerManualSummary(): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate-weekly-summary`, {});
  }

  // ✅ NEW: Download Weekly Invoice PDF
  downloadWeeklyInvoice(startDate: string): Observable<Blob> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(
      `/api/payments/weekly-invoice/pdf?startDate=${startDate}`,
      {
        headers,
        responseType: 'blob',
      }
    );
  }
}
