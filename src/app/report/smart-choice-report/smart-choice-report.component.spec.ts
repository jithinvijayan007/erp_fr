import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmartChoiceReportComponent } from './smart-choice-report.component';

describe('SmartChoiceReportComponent', () => {
  let component: SmartChoiceReportComponent;
  let fixture: ComponentFixture<SmartChoiceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartChoiceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartChoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
