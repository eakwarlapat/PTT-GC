import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInitiativeComponent } from './create.component';

describe('CreateInitiativesComponent', () => {
  let component: CreateInitiativeComponent;
  let fixture: ComponentFixture<CreateInitiativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInitiativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInitiativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
