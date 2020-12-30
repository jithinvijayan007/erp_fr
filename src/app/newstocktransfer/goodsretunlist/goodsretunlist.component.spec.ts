import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoodsretunlistComponent } from './goodsretunlist.component';

describe('GoodsretunlistComponent', () => {
  let component: GoodsretunlistComponent;
  let fixture: ComponentFixture<GoodsretunlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsretunlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsretunlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
