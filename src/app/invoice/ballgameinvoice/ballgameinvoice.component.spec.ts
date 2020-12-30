import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BallgameinvoiceComponent } from './ballgameinvoice.component';

describe('BallgameinvoiceComponent', () => {
  let component: BallgameinvoiceComponent;
  let fixture: ComponentFixture<BallgameinvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BallgameinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallgameinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
