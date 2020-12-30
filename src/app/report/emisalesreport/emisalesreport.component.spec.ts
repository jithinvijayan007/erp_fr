import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmisalesreportComponent } from './emisalesreport.component';

describe('EmisalesreportComponent', () => {
  let component: EmisalesreportComponent;
  let fixture: ComponentFixture<EmisalesreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmisalesreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmisalesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
