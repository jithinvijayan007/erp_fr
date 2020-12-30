import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductProfitReportComponent } from './product-profit-report.component';

describe('ProductProfitReportComponent', () => {
  let component: ProductProfitReportComponent;
  let fixture: ComponentFixture<ProductProfitReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductProfitReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductProfitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
