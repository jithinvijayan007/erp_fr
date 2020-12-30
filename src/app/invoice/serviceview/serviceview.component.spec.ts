import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceviewComponent } from './serviceview.component';

describe('ServiceviewComponent', () => {
  let component: ServiceviewComponent;
  let fixture: ComponentFixture<ServiceviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
