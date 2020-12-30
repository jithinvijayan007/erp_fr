import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GrnpurchaseComponent } from './grnpurchase.component';

describe('GrnpurchaseComponent', () => {
  let component: GrnpurchaseComponent;
  let fixture: ComponentFixture<GrnpurchaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnpurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
