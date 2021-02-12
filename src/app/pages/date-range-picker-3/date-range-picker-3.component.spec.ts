import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangePicker3Component } from './date-range-picker-3.component';

describe('DateRangePicker3Component', () => {
  let component: DateRangePicker3Component;
  let fixture: ComponentFixture<DateRangePicker3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangePicker3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangePicker3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
