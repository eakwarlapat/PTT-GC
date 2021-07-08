import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaxCapexComponent } from './view-max-capex.component';

describe('ViewMaxCapexComponent', () => {
  let component: ViewMaxCapexComponent;
  let fixture: ComponentFixture<ViewMaxCapexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMaxCapexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMaxCapexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
