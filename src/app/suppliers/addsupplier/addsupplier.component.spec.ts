import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddsupplierComponent } from './addsupplier.component';

describe('AddsupplierComponent', () => {
  let component: AddsupplierComponent;
  let fixture: ComponentFixture<AddsupplierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
