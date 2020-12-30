import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmartChoiceSaleComponent } from './smart-choice-sale.component';

describe('SmartChoiceSaleComponent', () => {
  let component: SmartChoiceSaleComponent;
  let fixture: ComponentFixture<SmartChoiceSaleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartChoiceSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartChoiceSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
