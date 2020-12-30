import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditcustomerComponent } from './editcustomer.component';

describe('EditcustomerComponent', () => {
  let component: EditcustomerComponent;
  let fixture: ComponentFixture<EditcustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditcustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
