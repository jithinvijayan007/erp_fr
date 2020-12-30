import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemcategorylistComponent } from './itemcategorylist.component';

describe('ItemcategorylistComponent', () => {
  let component: ItemcategorylistComponent;
  let fixture: ComponentFixture<ItemcategorylistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemcategorylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemcategorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
