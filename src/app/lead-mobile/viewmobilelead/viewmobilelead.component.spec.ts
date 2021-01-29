import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmobileleadComponent } from './viewmobilelead.component';

describe('ViewmobileleadComponent', () => {
  let component: ViewmobileleadComponent;
  let fixture: ComponentFixture<ViewmobileleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewmobileleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmobileleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
