import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LesshourrequestedListComponent } from './lesshourrequested-list.component';

describe('LesshourrequestedListComponent', () => {
  let component: LesshourrequestedListComponent;
  let fixture: ComponentFixture<LesshourrequestedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LesshourrequestedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LesshourrequestedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
