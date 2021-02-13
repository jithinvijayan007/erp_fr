import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesproductivityreportComponent } from './salesproductivityreport.component';

describe('SalesproductivityreportComponent', () => {
  let component: SalesproductivityreportComponent;
  let fixture: ComponentFixture<SalesproductivityreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesproductivityreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesproductivityreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
