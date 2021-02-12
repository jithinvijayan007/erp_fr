import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyDownloadComponent } from './monthly-download.component';

describe('MonthlyDownloadComponent', () => {
  let component: MonthlyDownloadComponent;
  let fixture: ComponentFixture<MonthlyDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
