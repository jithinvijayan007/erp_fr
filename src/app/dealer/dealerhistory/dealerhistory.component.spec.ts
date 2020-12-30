import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerhistoryComponent } from './dealerhistory.component';

describe('DealerhistoryComponent', () => {
  let component: DealerhistoryComponent;
  let fixture: ComponentFixture<DealerhistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
