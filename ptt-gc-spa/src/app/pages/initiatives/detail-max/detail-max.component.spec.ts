import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMaxComponent } from './detail-max.component';

describe('DetailMaxComponent', () => {
  let component: DetailMaxComponent;
  let fixture: ComponentFixture<DetailMaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailMaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
