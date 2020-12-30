import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DenominationComponent } from './denomination.component';

describe('DenominationComponent', () => {
  let component: DenominationComponent;
  let fixture: ComponentFixture<DenominationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DenominationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DenominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
