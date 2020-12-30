import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaserequestComponent } from './purchaserequest.component';

describe('PurchaserequestComponent', () => {
  let component: PurchaserequestComponent;
  let fixture: ComponentFixture<PurchaserequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaserequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaserequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
