import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesreturnviewComponent } from './salesreturnview.component';

describe('SalesreturnviewComponent', () => {
  let component: SalesreturnviewComponent;
  let fixture: ComponentFixture<SalesreturnviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesreturnviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesreturnviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
