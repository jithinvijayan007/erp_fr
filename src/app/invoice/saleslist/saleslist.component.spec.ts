import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SaleslistComponent } from './saleslist.component';

describe('SaleslistComponent', () => {
  let component: SaleslistComponent;
  let fixture: ComponentFixture<SaleslistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
