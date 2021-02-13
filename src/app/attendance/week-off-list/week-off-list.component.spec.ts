import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekOffListComponent } from './week-off-list.component';

describe('WeekOffListComponent', () => {
  let component: WeekOffListComponent;
  let fixture: ComponentFixture<WeekOffListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekOffListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekOffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
