import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImeiBatchScanComponent } from './imei-batch-scan.component';

describe('ImeiBatchScanComponent', () => {
  let component: ImeiBatchScanComponent;
  let fixture: ComponentFixture<ImeiBatchScanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImeiBatchScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImeiBatchScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
