import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAccoutingComponent } from './add-accouting.component';

describe('AddAccoutingComponent', () => {
  let component: AddAccoutingComponent;
  let fixture: ComponentFixture<AddAccoutingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
