import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CashclosureListComponent } from './cashclosure-list.component';

describe('CashclosureListComponent', () => {
  let component: CashclosureListComponent;
  let fixture: ComponentFixture<CashclosureListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CashclosureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashclosureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
