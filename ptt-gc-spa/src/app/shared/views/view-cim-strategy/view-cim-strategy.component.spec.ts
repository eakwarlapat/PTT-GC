import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCimStrategyComponent } from './view-cim-strategy.component';

describe('ViewCimStrategyComponent', () => {
  let component: ViewCimStrategyComponent;
  let fixture: ComponentFixture<ViewCimStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCimStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCimStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
