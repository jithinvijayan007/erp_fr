import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditgroupComponent } from './editgroup.component';

describe('EditgroupComponent', () => {
  let component: EditgroupComponent;
  let fixture: ComponentFixture<EditgroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
