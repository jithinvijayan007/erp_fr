import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BajajListComponent } from './bajaj-list.component';

describe('BajajListComponent', () => {
  let component: BajajListComponent;
  let fixture: ComponentFixture<BajajListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BajajListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BajajListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
