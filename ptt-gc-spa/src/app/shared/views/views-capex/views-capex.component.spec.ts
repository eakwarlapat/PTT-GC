import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsCapexComponent } from './views-capex.component';

describe('ViewsCapexComponent', () => {
  let component: ViewsCapexComponent;
  let fixture: ComponentFixture<ViewsCapexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsCapexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsCapexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
