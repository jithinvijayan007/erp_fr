import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailySalesReportComponent } from './daily-sales-report.component';

describe('DailySalesReportComponent', () => {
  let component: DailySalesReportComponent;
  let fixture: ComponentFixture<DailySalesReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailySalesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
