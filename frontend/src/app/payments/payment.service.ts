import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/emvironment'; // adjust path if needed

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/payments`;

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

  updatePayment(id: string, paymentData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, paymentData);
  }

  deletePayment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  triggerManualSummary(): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate-weekly-summary`, {});
  }

  downloadWeeklyInvoice(startDate: string): Observable<Blob> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(
      `${this.baseUrl}/weekly-invoice/pdf?startDate=${startDate}`,
      {
        headers,
        responseType: 'blob',
      }
    );
  }
}
