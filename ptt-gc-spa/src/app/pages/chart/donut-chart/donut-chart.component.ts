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
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  baseUrl = environment.apiUrl;  // Base URL
  queryParam = '';  // Get query string URL
  result: Result = null;  // result from api

  public options: any = {
    chart: {
      type: 'pie',
      height: 500,
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    plotOptions: {
      pie: {
        innerSize: 100,
        depth: 45
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

