import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectDropDownComponent } from './single-select-drop-down.component';

describe('SingleSelectDropDownComponent', () => {
  let component: SingleSelectDropDownComponent;
  let fixture: ComponentFixture<SingleSelectDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleSelectDropDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
