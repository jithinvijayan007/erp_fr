import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CashBookComponent } from './cash-book.component';

describe('CashBookComponent', () => {
  let component: CashBookComponent;
  let fixture: ComponentFixture<CashBookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CashBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
