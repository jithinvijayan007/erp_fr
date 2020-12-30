import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockAgeReportComponent } from './stock-age-report.component';

describe('StockAgeReportComponent', () => {
  let component: StockAgeReportComponent;
  let fixture: ComponentFixture<StockAgeReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAgeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAgeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
