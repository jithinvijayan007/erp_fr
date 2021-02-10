import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCustomerlistComponent } from './customerlist.component';

describe('PageCustomerlistComponent', () => {
  let component: PageCustomerlistComponent;
  let fixture: ComponentFixture<PageCustomerlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCustomerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCustomerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
