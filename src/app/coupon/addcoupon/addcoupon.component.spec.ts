import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddcouponComponent } from './addcoupon.component';

describe('AddcouponComponent', () => {
  let component: AddcouponComponent;
  let fixture: ComponentFixture<AddcouponComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
