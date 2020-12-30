import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImeiScanComponent } from './imei-scan.component';

describe('ImeiScanComponent', () => {
  let component: ImeiScanComponent;
  let fixture: ComponentFixture<ImeiScanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImeiScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImeiScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
