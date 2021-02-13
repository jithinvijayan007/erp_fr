import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftReportsComponent } from './shift-reports.component';

describe('ShiftReportsComponent', () => {
  let component: ShiftReportsComponent;
  let fixture: ComponentFixture<ShiftReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
