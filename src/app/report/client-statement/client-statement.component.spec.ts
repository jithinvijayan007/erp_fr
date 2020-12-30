import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientStatementComponent } from './client-statement.component';

describe('ClientStatementComponent', () => {
  let component: ClientStatementComponent;
  let fixture: ComponentFixture<ClientStatementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
