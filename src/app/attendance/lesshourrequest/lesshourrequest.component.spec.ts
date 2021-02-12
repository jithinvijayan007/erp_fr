import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LesshourrequestComponent } from './lesshourrequest.component';

describe('LesshourrequestComponent', () => {
  let component: LesshourrequestComponent;
  let fixture: ComponentFixture<LesshourrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LesshourrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LesshourrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
