import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewgroupComponent } from './viewgroup.component';

describe('ViewgroupComponent', () => {
  let component: ViewgroupComponent;
  let fixture: ComponentFixture<ViewgroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
