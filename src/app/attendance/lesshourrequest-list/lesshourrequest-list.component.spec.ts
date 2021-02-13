import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LesshourrequestListComponent } from './lesshourrequest-list.component';

describe('LesshourrequestListComponent', () => {
  let component: LesshourrequestListComponent;
  let fixture: ComponentFixture<LesshourrequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LesshourrequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LesshourrequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
