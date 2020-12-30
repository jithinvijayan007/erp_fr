import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoicecustomerComponent } from './invoicecustomer.component';

describe('InvoicecustomerComponent', () => {
  let component: InvoicecustomerComponent;
  let fixture: ComponentFixture<InvoicecustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicecustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicecustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
