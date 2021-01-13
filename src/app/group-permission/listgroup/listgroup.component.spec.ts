import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListgroupComponent } from './listgroup.component';

describe('ListgroupComponent', () => {
  let component: ListgroupComponent;
  let fixture: ComponentFixture<ListgroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
