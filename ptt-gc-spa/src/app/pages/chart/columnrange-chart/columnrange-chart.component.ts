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
  selector: 'app-columnrange-chart',
  templateUrl: './columnrange-chart.component.html',
  styleUrls: ['./columnrange-chart.component.css']
})
export class ColumnrangeChartComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  baseUrl = environment.apiUrl;  // Base URL
  queryParam = '';  // Get query string URL
  result: Result[] = [];  // result from api

  public options: any = {
    chart: {
      type: 'columnrange',
      height: 500,
      inverted: true
    },
    title: {
      text: 'columnrange-Chart',
    },
    xAxis: {
      categories: null,  // api
    },
    yAxis: {
      title: {
        text: 'Population (millions)'
      }
    },
    plotOptions: {
      columnrange: {
          dataLabels: {
              enabled: true,
              format: '{y}°C'
          }
      }
    },
    series: [{
      name: 'Temperatures',
      data: [
          [-9.9, 10.3],
          [-8.6, 8.5],
          [-10.2, 11.8],
          [-1.7, 12.2],
          [-0.6, 23.1],
          [3.7, 25.4],
          [6.0, 26.2],
          [6.7, 21.4],
          [3.5, 19.5],
          [-1.3, 16.0],
          [-8.7, 9.4],
          [-9.0, 8.6]
      ]
  }]
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['reportid'];
    });
    this.selectedChart(this.queryParam);
    Highcharts.chart('container', this.options);
  }

  selectedChart(reportid: string) {
    this.http.get<Result[]>(this.baseUrl + 'chart?reportid=' + this.queryParam).subscribe(r => {
      this.result = r;
      this.options.title.text = this.result["titletext"];
      this.options.xAxis.categories = this.result["catagories"];
      this.options.series = this.result["series"];
      console.log(this.result);
      // Highcharts.chart('container', this.options);
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
