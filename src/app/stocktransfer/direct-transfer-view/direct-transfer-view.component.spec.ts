import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DirectTransferViewComponent } from './direct-transfer-view.component';

describe('DirectTransferViewComponent', () => {
  let component: DirectTransferViewComponent;
  let fixture: ComponentFixture<DirectTransferViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectTransferViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectTransferViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
