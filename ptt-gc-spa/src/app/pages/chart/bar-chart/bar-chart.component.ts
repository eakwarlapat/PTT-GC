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
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  baseUrl = environment.apiUrl;  // Base URL
  queryParam = '';  // Get query string URL
  result: Result[] = [];  // result from api

  public options: any = {
    chart: {
      type: 'column',
      height: 500,
    },
    title: {
      text: 'Bar-Chart',
    },
    credits: {
      enabled: true
    },
    xAxis: {
      categories: null,  // api
      title: {
        text: null // api
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Benefit Amount',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    series: null  // api
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['reportid'];
    });
    this.selectedChart(this.queryParam);
  }

  selectedChart(reportid: string) {
    this.http.get<Result[]>(this.baseUrl + 'chart?reportid=' + this.queryParam).subscribe(r => {
      this.result = r;
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
  series: Series;
}
interface Series {
  name: string;
  data: number;
}
