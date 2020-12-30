import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListBranchStockComponent } from './list-branch-stock.component';

describe('ListBranchStockComponent', () => {
  let component: ListBranchStockComponent;
  let fixture: ComponentFixture<ListBranchStockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBranchStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBranchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
