import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAllocationNewListComponent } from './shift-allocation-new-list.component';

describe('ShiftAllocationNewListComponent', () => {
  let component: ShiftAllocationNewListComponent;
  let fixture: ComponentFixture<ShiftAllocationNewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftAllocationNewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftAllocationNewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
