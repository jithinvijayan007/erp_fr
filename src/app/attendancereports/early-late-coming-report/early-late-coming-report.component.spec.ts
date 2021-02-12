import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyLateComingReportComponent } from './early-late-coming-report.component';

describe('EarlyLateComingReportComponent', () => {
  let component: EarlyLateComingReportComponent;
  let fixture: ComponentFixture<EarlyLateComingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarlyLateComingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyLateComingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
