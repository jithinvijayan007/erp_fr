import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SezInvoiceComponent } from './sez-invoice.component';

describe('SezInvoiceComponent', () => {
  let component: SezInvoiceComponent;
  let fixture: ComponentFixture<SezInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SezInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SezInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
