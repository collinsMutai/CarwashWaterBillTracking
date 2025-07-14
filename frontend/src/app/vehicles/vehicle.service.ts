import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private baseUrl = '/api/vehicles';

  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addVehicle(vehicle: {
    registration: string;
    description: string;
  }): Observable<any> {
    return this.http.post<any>(this.baseUrl, vehicle);
  }
}
