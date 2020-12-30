import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListpaymentComponent } from './listpayment.component';

describe('ListpaymentComponent', () => {
  let component: ListpaymentComponent;
  let fixture: ComponentFixture<ListpaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListpaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
