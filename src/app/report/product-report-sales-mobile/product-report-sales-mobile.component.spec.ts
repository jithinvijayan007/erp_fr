import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReportSalesMobileComponent } from './product-report-sales-mobile.component';

describe('ProductReportSalesMobileComponent', () => {
  let component: ProductReportSalesMobileComponent;
  let fixture: ComponentFixture<ProductReportSalesMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductReportSalesMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReportSalesMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
