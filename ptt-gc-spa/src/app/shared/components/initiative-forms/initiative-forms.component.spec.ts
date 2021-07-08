import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeFormsComponent } from './initiative-forms.component';

describe('InitiativeFormsComponent', () => {
  let component: InitiativeFormsComponent;
  let fixture: ComponentFixture<InitiativeFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativeFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
