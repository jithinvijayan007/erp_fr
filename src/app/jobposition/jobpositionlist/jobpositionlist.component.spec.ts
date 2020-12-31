import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobpositionlistComponent } from './jobpositionlist.component';

describe('JobpositionlistComponent', () => {
  let component: JobpositionlistComponent;
  let fixture: ComponentFixture<JobpositionlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobpositionlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobpositionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
