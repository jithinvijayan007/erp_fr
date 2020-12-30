import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlinesalesviewComponent } from './onlinesalesview.component';

describe('OnlinesalesviewComponent', () => {
  let component: OnlinesalesviewComponent;
  let fixture: ComponentFixture<OnlinesalesviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinesalesviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinesalesviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
