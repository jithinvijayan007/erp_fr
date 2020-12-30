import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditAccountingComponent } from './edit-accounting.component';

describe('EditAccountingComponent', () => {
  let component: EditAccountingComponent;
  let fixture: ComponentFixture<EditAccountingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccountingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
