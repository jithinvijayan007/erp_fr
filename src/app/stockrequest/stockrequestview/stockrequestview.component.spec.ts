import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockrequestviewComponent } from './stockrequestview.component';

describe('StockrequestviewComponent', () => {
  let component: StockrequestviewComponent;
  let fixture: ComponentFixture<StockrequestviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockrequestviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockrequestviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
