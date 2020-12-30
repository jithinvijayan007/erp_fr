import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImeiLookupComponent } from './imei-lookup.component';

describe('ImeiLookupComponent', () => {
  let component: ImeiLookupComponent;
  let fixture: ComponentFixture<ImeiLookupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImeiLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImeiLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
