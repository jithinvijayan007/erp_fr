import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RechargeProfitReportComponent } from './recharge-profit-report.component';

describe('RechargeProfitReportComponent', () => {
  let component: RechargeProfitReportComponent;
  let fixture: ComponentFixture<RechargeProfitReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeProfitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeProfitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
