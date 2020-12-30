import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceinvoicelistComponent } from './serviceinvoicelist.component';

describe('ServiceinvoicelistComponent', () => {
  let component: ServiceinvoicelistComponent;
  let fixture: ComponentFixture<ServiceinvoicelistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceinvoicelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceinvoicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
