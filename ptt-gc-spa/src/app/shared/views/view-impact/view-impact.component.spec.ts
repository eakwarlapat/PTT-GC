import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImpactComponent } from './view-impact.component';

describe('ViewImpactComponent', () => {
  let component: ViewImpactComponent;
  let fixture: ComponentFixture<ViewImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
