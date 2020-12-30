import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OffersaleslistComponent } from './offersaleslist.component';

describe('OffersaleslistComponent', () => {
  let component: OffersaleslistComponent;
  let fixture: ComponentFixture<OffersaleslistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersaleslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersaleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
