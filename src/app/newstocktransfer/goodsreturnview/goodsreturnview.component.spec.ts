import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoodsreturnviewComponent } from './goodsreturnview.component';

describe('GoodsreturnviewComponent', () => {
  let component: GoodsreturnviewComponent;
  let fixture: ComponentFixture<GoodsreturnviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsreturnviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsreturnviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
