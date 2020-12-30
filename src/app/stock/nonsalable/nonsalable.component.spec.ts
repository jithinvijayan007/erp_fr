import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NonsalableComponent } from './nonsalable.component';

describe('NonsalableComponent', () => {
  let component: NonsalableComponent;
  let fixture: ComponentFixture<NonsalableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NonsalableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonsalableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
