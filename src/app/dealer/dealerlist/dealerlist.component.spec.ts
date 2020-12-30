import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealerlistComponent } from './dealerlist.component';

describe('DealerlistComponent', () => {
  let component: DealerlistComponent;
  let fixture: ComponentFixture<DealerlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
