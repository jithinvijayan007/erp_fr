import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilebranchsalesreportComponent } from './mobilebranchsalesreport.component';

describe('MobilebranchsalesreportComponent', () => {
  let component: MobilebranchsalesreportComponent;
  let fixture: ComponentFixture<MobilebranchsalesreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilebranchsalesreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilebranchsalesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
