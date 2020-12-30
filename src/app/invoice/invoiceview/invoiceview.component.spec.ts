import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceviewComponent } from './invoiceview.component';

describe('InvoiceviewComponent', () => {
  let component: InvoiceviewComponent;
  let fixture: ComponentFixture<InvoiceviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
