import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceiptOrderListComponent } from './receipt-order-list.component';

describe('ReceiptOrderListComponent', () => {
  let component: ReceiptOrderListComponent;
  let fixture: ComponentFixture<ReceiptOrderListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
