import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewserviceComponent } from './viewservice.component';

describe('ViewserviceComponent', () => {
  let component: ViewserviceComponent;
  let fixture: ComponentFixture<ViewserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
