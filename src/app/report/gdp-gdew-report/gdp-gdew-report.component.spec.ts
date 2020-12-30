import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GdpGdewReportComponent } from './gdp-gdew-report.component';

describe('GdpGdewReportComponent', () => {
  let component: GdpGdewReportComponent;
  let fixture: ComponentFixture<GdpGdewReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GdpGdewReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdpGdewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
