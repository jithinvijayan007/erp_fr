import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddloyaltycardComponent } from './addloyaltycard.component';

describe('AddloyaltycardComponent', () => {
  let component: AddloyaltycardComponent;
  let fixture: ComponentFixture<AddloyaltycardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddloyaltycardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddloyaltycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
