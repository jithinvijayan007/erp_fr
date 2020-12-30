import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListsupplierComponent } from './listsupplier.component';

describe('ListsupplierComponent', () => {
  let component: ListsupplierComponent;
  let fixture: ComponentFixture<ListsupplierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListsupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
