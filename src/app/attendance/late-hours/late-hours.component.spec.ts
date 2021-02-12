import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LateHoursComponent } from './late-hours.component';

describe('LateHoursComponent', () => {
  let component: LateHoursComponent;
  let fixture: ComponentFixture<LateHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LateHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
