import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpendingComponent } from './viewpending.component';

describe('ViewpendingComponent', () => {
  let component: ViewpendingComponent;
  let fixture: ComponentFixture<ViewpendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewpendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
