import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LedgerStatementComponent } from "./ledger-statement.component";

describe('LedgerStatementComponent', () => {
  let component: LedgerStatementComponent;
  let fixture: ComponentFixture<LedgerStatementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
