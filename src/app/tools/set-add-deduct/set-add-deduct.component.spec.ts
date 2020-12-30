import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetAddDeductComponent } from './set-add-deduct.component';

describe('SetAddDeductComponent', () => {
  let component: SetAddDeductComponent;
  let fixture: ComponentFixture<SetAddDeductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetAddDeductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetAddDeductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
