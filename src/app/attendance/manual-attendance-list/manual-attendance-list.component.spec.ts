import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAttendanceListComponent } from './manual-attendance-list.component';

describe('ManualAttendanceListComponent', () => {
  let component: ManualAttendanceListComponent;
  let fixture: ComponentFixture<ManualAttendanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualAttendanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
