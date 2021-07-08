import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeDetailComponent } from './initiative-detail.component';

describe('InitiativeDetailComponent', () => {
  let component: InitiativeDetailComponent;
  let fixture: ComponentFixture<InitiativeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
