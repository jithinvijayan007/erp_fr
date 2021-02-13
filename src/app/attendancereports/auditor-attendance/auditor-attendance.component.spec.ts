import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorAttendanceComponent } from './auditor-attendance.component';

describe('AuditorAttendanceComponent', () => {
  let component: AuditorAttendanceComponent;
  let fixture: ComponentFixture<AuditorAttendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditorAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
