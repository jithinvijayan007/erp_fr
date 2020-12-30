import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StocktransferReportComponent } from './stocktransfer-report.component';

describe('StocktransferReportComponent', () => {
  let component: StocktransferReportComponent;
  let fixture: ComponentFixture<StocktransferReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StocktransferReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
