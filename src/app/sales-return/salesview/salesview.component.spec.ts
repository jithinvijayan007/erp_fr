import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesviewComponent } from './salesview.component';

describe('SalesviewComponent', () => {
  let component: SalesviewComponent;
  let fixture: ComponentFixture<SalesviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
