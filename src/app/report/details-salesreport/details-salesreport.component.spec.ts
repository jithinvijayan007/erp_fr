import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailsSalesreportComponent } from './details-salesreport.component';

describe('DetailsSalesreportComponent', () => {
  let component: DetailsSalesreportComponent;
  let fixture: ComponentFixture<DetailsSalesreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsSalesreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsSalesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
