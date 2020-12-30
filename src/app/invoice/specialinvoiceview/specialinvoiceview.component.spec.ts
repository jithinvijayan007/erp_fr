import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpecialinvoiceviewComponent } from './specialinvoiceview.component';

describe('SpecialinvoiceviewComponent', () => {
  let component: SpecialinvoiceviewComponent;
  let fixture: ComponentFixture<SpecialinvoiceviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialinvoiceviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialinvoiceviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
