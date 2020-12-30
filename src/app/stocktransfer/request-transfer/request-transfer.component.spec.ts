import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestTransferComponent } from './request-transfer.component';

describe('RequestTransferComponent', () => {
  let component: RequestTransferComponent;
  let fixture: ComponentFixture<RequestTransferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
