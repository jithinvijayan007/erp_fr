import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GdpServiceviewComponent } from './gdp-serviceview.component';

describe('GdpServiceviewComponent', () => {
  let component: GdpServiceviewComponent;
  let fixture: ComponentFixture<GdpServiceviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GdpServiceviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdpServiceviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
