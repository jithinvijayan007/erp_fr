import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyattendanceComponent } from './monthlyattendance.component';

describe('MonthlyattendanceComponent', () => {
  let component: MonthlyattendanceComponent;
  let fixture: ComponentFixture<MonthlyattendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyattendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
