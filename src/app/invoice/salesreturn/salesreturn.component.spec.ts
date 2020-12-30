import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesreturnComponent } from './salesreturn.component';

describe('SalesreturnComponent', () => {
  let component: SalesreturnComponent;
  let fixture: ComponentFixture<SalesreturnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
