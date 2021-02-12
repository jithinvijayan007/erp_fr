import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftExemptionComponent } from './shift-exemption.component';

describe('ShiftExemptionComponent', () => {
  let component: ShiftExemptionComponent;
  let fixture: ComponentFixture<ShiftExemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftExemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
