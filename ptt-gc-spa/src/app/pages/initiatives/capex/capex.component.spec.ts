import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapexComponent } from './capex.component';

describe('CapexComponent', () => {
  let component: CapexComponent;
  let fixture: ComponentFixture<CapexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
