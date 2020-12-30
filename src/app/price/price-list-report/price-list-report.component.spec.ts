import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PriceListReportComponent } from './price-list-report.component';

describe('PriceListReportComponent', () => {
  let component: PriceListReportComponent;
  let fixture: ComponentFixture<PriceListReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceListReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
