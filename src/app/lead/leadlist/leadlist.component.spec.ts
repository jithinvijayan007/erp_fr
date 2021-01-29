import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLeadlistComponent } from './leadlist.component';

describe('PageLeadlistComponent', () => {
  let component: PageLeadlistComponent;
  let fixture: ComponentFixture<PageLeadlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLeadlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLeadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
