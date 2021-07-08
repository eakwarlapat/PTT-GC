import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeButtonComponent } from './initiative-button.component';

describe('InitiativeButtonComponent', () => {
  let component: InitiativeButtonComponent;
  let fixture: ComponentFixture<InitiativeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
