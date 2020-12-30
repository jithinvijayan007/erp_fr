import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlinesalesorderlistComponent } from './onlinesalesorderlist.component';

describe('OnlinesalesorderlistComponent', () => {
  let component: OnlinesalesorderlistComponent;
  let fixture: ComponentFixture<OnlinesalesorderlistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinesalesorderlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinesalesorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
