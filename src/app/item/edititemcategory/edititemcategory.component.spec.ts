import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EdititemcategoryComponent } from './edititemcategory.component';

describe('EdititemcategoryComponent', () => {
  let component: EdititemcategoryComponent;
  let fixture: ComponentFixture<EdititemcategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EdititemcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdititemcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
