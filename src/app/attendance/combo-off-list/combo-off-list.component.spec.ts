import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboOffListComponent } from './combo-off-list.component';

describe('ComboOffListComponent', () => {
  let component: ComboOffListComponent;
  let fixture: ComponentFixture<ComboOffListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboOffListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboOffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
