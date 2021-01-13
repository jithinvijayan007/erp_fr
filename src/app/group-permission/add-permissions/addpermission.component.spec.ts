import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddpermissionComponent } from './addpermission.component';

describe('AddpermissionComponent', () => {
  let component: AddpermissionComponent;
  let fixture: ComponentFixture<AddpermissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
