import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditpriceComponent } from './editprice.component';

describe('EditpriceComponent', () => {
  let component: EditpriceComponent;
  let fixture: ComponentFixture<EditpriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
