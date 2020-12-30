import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewsupplierComponent } from './viewsupplier.component';

describe('ViewsupplierComponent', () => {
  let component: ViewsupplierComponent;
  let fixture: ComponentFixture<ViewsupplierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
