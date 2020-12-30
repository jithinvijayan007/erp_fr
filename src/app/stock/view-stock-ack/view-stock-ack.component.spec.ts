import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewStockAckComponent } from './view-stock-ack.component';

describe('ViewStockAckComponent', () => {
  let component: ViewStockAckComponent;
  let fixture: ComponentFixture<ViewStockAckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStockAckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStockAckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
