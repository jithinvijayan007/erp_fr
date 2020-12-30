import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddschemaComponent } from './addschema.component';

describe('AddschemaComponent', () => {
  let component: AddschemaComponent;
  let fixture: ComponentFixture<AddschemaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddschemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddschemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
