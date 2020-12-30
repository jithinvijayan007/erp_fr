import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdddealerComponent } from './adddealer.component';

describe('AdddealerComponent', () => {
  let component: AdddealerComponent;
  let fixture: ComponentFixture<AdddealerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdddealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
