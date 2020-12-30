import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JioinvoiceviewComponent } from './jioinvoiceview.component';

describe('JioinvoiceviewComponent', () => {
  let component: JioinvoiceviewComponent;
  let fixture: ComponentFixture<JioinvoiceviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JioinvoiceviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JioinvoiceviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
