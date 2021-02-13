import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboOffReportComponent } from './combo-off-report.component';

describe('ComboOffReportComponent', () => {
  let component: ComboOffReportComponent;
  let fixture: ComponentFixture<ComboOffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboOffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboOffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
