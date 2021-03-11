import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrewardComponent } from './addreward.component';

describe('AddrewardComponent', () => {
  let component: AddrewardComponent;
  let fixture: ComponentFixture<AddrewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddrewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddrewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
