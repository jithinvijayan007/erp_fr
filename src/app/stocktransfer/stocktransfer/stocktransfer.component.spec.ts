import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StocktransferComponent } from './stocktransfer.component';

describe('StocktransferComponent', () => {
  let component: StocktransferComponent;
  let fixture: ComponentFixture<StocktransferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StocktransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
