import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAllocationNewComponent } from './shift-allocation-new.component';

describe('ShiftAllocationNewComponent', () => {
  let component: ShiftAllocationNewComponent;
  let fixture: ComponentFixture<ShiftAllocationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftAllocationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftAllocationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
