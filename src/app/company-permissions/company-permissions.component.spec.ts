import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyPermissionsComponent } from './company-permissions.component';

describe('CompanyPermissionsComponent', () => {
  let component: CompanyPermissionsComponent;
  let fixture: ComponentFixture<CompanyPermissionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
