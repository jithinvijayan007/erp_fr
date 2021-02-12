import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftExemptionListComponent } from './shift-exemption-list.component';

describe('ShiftExemptionListComponent', () => {
  let component: ShiftExemptionListComponent;
  let fixture: ComponentFixture<ShiftExemptionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftExemptionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftExemptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
