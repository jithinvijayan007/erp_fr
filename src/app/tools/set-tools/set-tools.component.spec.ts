import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetToolsComponent } from './set-tools.component';

describe('SetToolsComponent', () => {
  let component: SetToolsComponent;
  let fixture: ComponentFixture<SetToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
