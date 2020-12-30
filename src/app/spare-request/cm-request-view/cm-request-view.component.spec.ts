import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmRequestViewComponent } from './cm-request-view.component';

describe('CmRequestViewComponent', () => {
  let component: CmRequestViewComponent;
  let fixture: ComponentFixture<CmRequestViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CmRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
