import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewcouponComponent } from './viewcoupon.component';

describe('ViewcouponComponent', () => {
  let component: ViewcouponComponent;
  let fixture: ComponentFixture<ViewcouponComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
