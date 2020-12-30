import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrintcomponentComponent } from './printcomponent.component';

describe('PrintcomponentComponent', () => {
  let component: PrintcomponentComponent;
  let fixture: ComponentFixture<PrintcomponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
