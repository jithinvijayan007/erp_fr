import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BajajViewComponent } from './bajaj-view.component';

describe('BajajViewComponent', () => {
  let component: BajajViewComponent;
  let fixture: ComponentFixture<BajajViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BajajViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BajajViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
