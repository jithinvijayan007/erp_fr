import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Addreward1Component } from './addreward1.component';

describe('Addreward1Component', () => {
  let component: Addreward1Component;
  let fixture: ComponentFixture<Addreward1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Addreward1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Addreward1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
