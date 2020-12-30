import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAccoutingComponent } from './list-accouting.component';

describe('ListAccoutingComponent', () => {
  let component: ListAccoutingComponent;
  let fixture: ComponentFixture<ListAccoutingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAccoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
