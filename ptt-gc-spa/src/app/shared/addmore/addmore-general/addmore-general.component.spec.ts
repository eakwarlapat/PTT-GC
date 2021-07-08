import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmoreGeneralComponent } from './addmore-general.component';

describe('AddmoreGeneralComponent', () => {
  let component: AddmoreGeneralComponent;
  let fixture: ComponentFixture<AddmoreGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmoreGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmoreGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
