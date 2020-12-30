import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewToolsComponent } from './view-tools.component';

describe('ViewToolsComponent', () => {
  let component: ViewToolsComponent;
  let fixture: ComponentFixture<ViewToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
