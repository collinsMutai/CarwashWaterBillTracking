import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPaymentComponent } from './daily-payment.component';

describe('DailyPaymentComponent', () => {
  let component: DailyPaymentComponent;
  let fixture: ComponentFixture<DailyPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
