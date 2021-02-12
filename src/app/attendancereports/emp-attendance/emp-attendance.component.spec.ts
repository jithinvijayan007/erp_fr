import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttendanceComponent } from './emp-attendance.component';

describe('EmpAttendanceComponent', () => {
  let component: EmpAttendanceComponent;
  let fixture: ComponentFixture<EmpAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
