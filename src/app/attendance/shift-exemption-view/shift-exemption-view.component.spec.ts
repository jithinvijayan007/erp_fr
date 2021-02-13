import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftExemptionViewComponent } from './shift-exemption-view.component';

describe('ShiftExemptionViewComponent', () => {
  let component: ShiftExemptionViewComponent;
  let fixture: ComponentFixture<ShiftExemptionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftExemptionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftExemptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
