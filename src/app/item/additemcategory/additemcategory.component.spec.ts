import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdditemcategoryComponent } from './additemcategory.component';

describe('AdditemcategoryComponent', () => {
  let component: AdditemcategoryComponent;
  let fixture: ComponentFixture<AdditemcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditemcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditemcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
