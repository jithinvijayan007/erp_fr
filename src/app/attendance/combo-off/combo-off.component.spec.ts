import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboOffComponent } from './combo-off.component';

describe('ComboOffComponent', () => {
  let component: ComboOffComponent;
  let fixture: ComponentFixture<ComboOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
