import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ActivatedRoute } from '@angular/router';
import 'chartjs-plugin-annotation';

exporting(Highcharts);

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-stacked-chart',
  templateUrl: './stacked-chart.component.html',
})
export class StackedChartComponent implements OnInit {

  valueP = '1';
  dataX: any = [];
  dataY: any = [];

  isLoading = false;
  ss: any;
  result: Result[] = [];

  baseUrl = environment.apiUrl;

  queryParam = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  public setHead: any = [

  ];

  public options: any = {
    chart: {
      type: 'column'
    },
    title: {
      text: null, // 'Stacked column chart'
    },
    xAxis: {
      categories: null,
      plotLines: [{
        color: '#FF0000',
        width: 0,
        value: 2.5,
        label: {
          text: '',
          rotation: 0,
        },
        zIndex: 99
      }]
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Benefit Amount',
        subtitle: 'ssssss'

      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: ( // theme
            Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color
          ) || 'gray'
        }
      }
    },
    legend: {
      align: 'center',
      x: 30,
      verticalAlign: 'top',
      y: 20,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: null
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['reportid'];
    });
    this.selectedChart(this.queryParam);
  }

  selectedChart(reportid: string) {
    // this.valueP = b1;
    // alert(b1);
    this.http.get<Result[]>(this.baseUrl + 'chart?reportid=' + this.queryParam).subscribe(r => {
      this.result = r;
      //  //this.getfood();
      this.options.title.text = this.result["titletext"];
      this.options.xAxis.categories = this.result["catagories"];
      this.options.series = this.result["series"];
      console.log(this.result);
      Highcharts.chart('container', this.options);
    }, error => console.error(error));
  }

}

interface RootObject {
  result: Result[];
}
interface Result {
  titletext: string;
  categories: string[];
  series: series;
}
interface series {
  name: string;
  data: number;
  color: '#00FF00';
}
