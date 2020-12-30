import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DayclosurereportComponent } from './dayclosurereport.component';

describe('DayclosurereportComponent', () => {
  let component: DayclosurereportComponent;
  let fixture: ComponentFixture<DayclosurereportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DayclosurereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayclosurereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
