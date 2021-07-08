import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ActivatedRoute } from '@angular/router';


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
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  baseUrl = environment.apiUrl;  // Base URL
  queryParam = '';  // Get query string URL
  result: Result = null;  // result from api

  public options: any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: ''
    },
    tooltip: {
       pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y:.2f}'
        }
      }
    },
    // series: [{data : [{ name:'IL0',y:0.0},{name:'IL1',y:11.437},{name:'IL2',y:6.4722},{name:'IL3',y:4.398}]}]
    // series: [{data :  null }]
    series: null,
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['reportid'];
    });
    this.selectedChart(this.queryParam);
  }

  selectedChart(reportid: string) {
    this.http.get<Result>(this.baseUrl + 'Chart/PieChart?reportid=' + this.queryParam).subscribe(r => {
      this.result = r;
      this.options.title.text = this.result["titletext"];
      this.options.series = this.result["series"];
      console.log(this.result);
      Highcharts.chart('container', this.options);
      console.log(JSON.stringify(this.result));
    }, error => console.error(error));
  }
}

interface RootObject {
  result: Result[];
}
interface Result {
  Title: string;
  Name: string;
  series: Series;
}
interface Series {
  data: Data[];
}
interface Data {
  name: string;
  y: number;
}

