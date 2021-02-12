import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndutyRequestedListComponent } from './onduty-requested-list.component';

describe('OndutyRequestedListComponent', () => {
  let component: OndutyRequestedListComponent;
  let fixture: ComponentFixture<OndutyRequestedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndutyRequestedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndutyRequestedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
