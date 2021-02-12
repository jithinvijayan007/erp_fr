import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddshiftComponent } from './addshift.component';

describe('AddshiftComponent', () => {
  let component: AddshiftComponent;
  let fixture: ComponentFixture<AddshiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddshiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
