import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditdealerComponent } from './editdealer.component';

describe('EditdealerComponent', () => {
  let component: EditdealerComponent;
  let fixture: ComponentFixture<EditdealerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditdealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
