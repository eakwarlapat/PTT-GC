import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDimComponent } from './detail-dim.component';

describe('DetailDimComponent', () => {
  let component: DetailDimComponent;
  let fixture: ComponentFixture<DetailDimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
