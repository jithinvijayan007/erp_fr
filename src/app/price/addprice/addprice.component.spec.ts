import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddpriceComponent } from './addprice.component';

describe('AddpriceComponent', () => {
  let component: AddpriceComponent;
  let fixture: ComponentFixture<AddpriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
