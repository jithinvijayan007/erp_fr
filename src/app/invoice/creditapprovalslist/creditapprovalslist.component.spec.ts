import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditapprovalslistComponent } from './creditapprovalslist.component';

describe('CreditapprovalslistComponent', () => {
  let component: CreditapprovalslistComponent;
  let fixture: ComponentFixture<CreditapprovalslistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditapprovalslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditapprovalslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
