import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInitiativeComponent } from './detail.component';

describe('DetailInitiativeComponent', () => {
  let component: DetailInitiativeComponent;
  let fixture: ComponentFixture<DetailInitiativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInitiativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInitiativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
