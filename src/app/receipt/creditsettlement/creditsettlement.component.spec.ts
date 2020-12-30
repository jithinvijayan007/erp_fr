import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditsettlementComponent } from './creditsettlement.component';

describe('CreditsettlementComponent', () => {
  let component: CreditsettlementComponent;
  let fixture: ComponentFixture<CreditsettlementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
