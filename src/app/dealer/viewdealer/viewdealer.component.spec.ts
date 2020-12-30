import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewdealerComponent } from './viewdealer.component';

describe('ViewdealerComponent', () => {
  let component: ViewdealerComponent;
  let fixture: ComponentFixture<ViewdealerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewdealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewdealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
