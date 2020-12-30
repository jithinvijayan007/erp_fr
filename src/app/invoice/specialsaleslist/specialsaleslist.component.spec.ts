import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpecialsaleslistComponent } from './specialsaleslist.component';

describe('SpecialsaleslistComponent', () => {
  let component: SpecialsaleslistComponent;
  let fixture: ComponentFixture<SpecialsaleslistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialsaleslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialsaleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
