import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobpositioneditComponent } from './jobpositionedit.component';

describe('JobpositioneditComponent', () => {
  let component: JobpositioneditComponent;
  let fixture: ComponentFixture<JobpositioneditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobpositioneditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobpositioneditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
