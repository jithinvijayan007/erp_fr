import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExchangeViewComponent } from './exchange-view.component';

describe('ExchangeViewComponent', () => {
  let component: ExchangeViewComponent;
  let fixture: ComponentFixture<ExchangeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
