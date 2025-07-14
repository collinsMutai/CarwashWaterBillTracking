import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-vehicle-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-selector.component.html',
  styleUrls: ['./vehicle-selector.component.css'],
})
export class VehicleSelectorComponent {
  @Output() vehicleSelected = new EventEmitter<any>();

  vehicles: any[] = [];
  filtered: any[] = [];
  searchTerm = '';
  newVehicle = { registration: '', description: '' };
  showNewForm = false;

  constructor(private vehicleService: VehicleService) {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getAllVehicles().subscribe((data) => {
      this.vehicles = data;
      this.filterVehicles();
    });
  }

  filterVehicles() {
    this.filtered = this.vehicles.filter((v) =>
      v.registration.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectVehicle(vehicle: any) {
    this.vehicleSelected.emit(vehicle);
  }

  addNewVehicle() {
    if (!this.newVehicle.registration) return;

    this.vehicleService.addVehicle(this.newVehicle).subscribe((saved) => {
      this.vehicles.push(saved);
      this.vehicleSelected.emit(saved);
      this.newVehicle = { registration: '', description: '' };
      this.showNewForm = false;
    });
  }
}
