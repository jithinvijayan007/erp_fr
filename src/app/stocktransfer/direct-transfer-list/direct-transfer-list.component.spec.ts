import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DirectTransferListComponent } from './direct-transfer-list.component';

describe('DirectTransferListComponent', () => {
  let component: DirectTransferListComponent;
  let fixture: ComponentFixture<DirectTransferListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectTransferListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
