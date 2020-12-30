import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DayclosureListComponent } from './dayclosure-list.component';

describe('DayclosureListComponent', () => {
  let component: DayclosureListComponent;
  let fixture: ComponentFixture<DayclosureListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DayclosureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayclosureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
