import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralizeReportComponent } from './generalize-report.component';

describe('GeneralizeReportComponent', () => {
  let component: GeneralizeReportComponent;
  let fixture: ComponentFixture<GeneralizeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralizeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralizeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
