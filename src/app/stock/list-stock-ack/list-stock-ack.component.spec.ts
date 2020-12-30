import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListStockAckComponent } from './list-stock-ack.component';

describe('ListStockAckComponent', () => {
  let component: ListStockAckComponent;
  let fixture: ComponentFixture<ListStockAckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStockAckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStockAckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
