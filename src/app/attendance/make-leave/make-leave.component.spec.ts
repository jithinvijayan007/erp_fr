import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeLeaveComponent } from './make-leave.component';

describe('MakeLeaveComponent', () => {
  let component: MakeLeaveComponent;
  let fixture: ComponentFixture<MakeLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
