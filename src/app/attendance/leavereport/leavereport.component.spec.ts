import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavereportComponent } from './leavereport.component';

describe('LeavereportComponent', () => {
  let component: LeavereportComponent;
  let fixture: ComponentFixture<LeavereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
