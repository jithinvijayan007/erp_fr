import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddgoodsreturnComponent } from './addgoodsreturn.component';

describe('AddgoodsreturnComponent', () => {
  let component: AddgoodsreturnComponent;
  let fixture: ComponentFixture<AddgoodsreturnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddgoodsreturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgoodsreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
