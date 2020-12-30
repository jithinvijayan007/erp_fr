import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailedModelWiseSalesReportComponent } from './detailed-model-wise-sales-report.component';

describe('DetailedModelWiseSalesReportComponent', () => {
  let component: DetailedModelWiseSalesReportComponent;
  let fixture: ComponentFixture<DetailedModelWiseSalesReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedModelWiseSalesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedModelWiseSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
