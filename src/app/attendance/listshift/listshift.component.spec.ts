import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListshiftComponent } from './listshift.component';

describe('ListshiftComponent', () => {
  let component: ListshiftComponent;
  let fixture: ComponentFixture<ListshiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
