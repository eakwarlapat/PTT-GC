import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnrangeChartComponent } from './columnrange-chart.component';

describe('ColumnrangeChartComponent', () => {
  let component: ColumnrangeChartComponent;
  let fixture: ComponentFixture<ColumnrangeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnrangeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnrangeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
