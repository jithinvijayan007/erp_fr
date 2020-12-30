import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReturninvoiceComponent } from './returninvoice.component';

describe('ReturninvoiceComponent', () => {
  let component: ReturninvoiceComponent;
  let fixture: ComponentFixture<ReturninvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturninvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturninvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
