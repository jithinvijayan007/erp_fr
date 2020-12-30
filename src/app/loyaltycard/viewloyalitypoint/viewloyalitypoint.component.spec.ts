import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewloyalitypointComponent } from './viewloyalitypoint.component';

describe('ViewloyalitypointComponent', () => {
  let component: ViewloyalitypointComponent;
  let fixture: ComponentFixture<ViewloyalitypointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewloyalitypointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewloyalitypointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
