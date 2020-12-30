import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditsalereportComponent } from './creditsalereport.component';

describe('CreditsalereportComponent', () => {
  let component: CreditsalereportComponent;
  let fixture: ComponentFixture<CreditsalereportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsalereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsalereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
