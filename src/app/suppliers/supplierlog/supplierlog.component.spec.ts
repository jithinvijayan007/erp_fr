import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupplierlogComponent } from './supplierlog.component';

describe('SupplierlogComponent', () => {
  let component: SupplierlogComponent;
  let fixture: ComponentFixture<SupplierlogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
