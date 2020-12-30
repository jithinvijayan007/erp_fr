import { Component, AfterViewInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as c3 from 'c3';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';

declare var require: any;

const data: any = require('./data.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  templateUrl: './dashboard3.component.html',
  styleUrls: ['./dashboard3.component.css']
})
export class Dashboard3Component implements AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};

  constructor() { }

  lineChart: Chart = {
    type: 'Line',
    data: data['Line'],
    options: {
      low: 0,
      high: 48,
      showArea: true,
      fullWidth: true,
      axisY: {
        onlyInteger: true,
        scaleMinSpace: 40,
        offset: 20,
        labelInterpolationFnc: function (value) {
          return (value / 10) + 'k';
        }
      }
    }
  };

  barChart1: Chart = {
    type: 'Bar',
    data: data['Bar'],
    options: {
      stackBars: true,
      axisY: {
        labelInterpolationFnc: function (value) {
          return (value / 1) + 'k';
        },
        scaleMinSpace: 55
      },
      axisX: {
        showGrid: false
      },
      seriesBarDistance: 1,
      chartPadding: {
        top: 15,
        right: 15,
        bottom: 5,
        left: 0
      }
    }
  };

  ngAfterViewInit() {
    const chart1 = c3.generate({
      bindto: '.weather-report',
      data: {
        columns: [
          ['Day 1', 21, 15, 30, 45, 15]
        ],
        type: 'area-spline'
      },
      axis: {
        y: {
          show: false,
          tick: {
            count: 0,
            outer: false
          }
        },
        x: {
          show: false,
        }
      },
      padding: {
        top: 0,
        right: -8,
        bottom: -28,
        left: -8,
      },
      point: {
        r: 2,
      },
      legend: {
        hide: true
      },
      color: {
        pattern: ['#fff']
      }

    });

    const chart2 = c3.generate({
      bindto: '.status',
      data: {
        columns: [
          ['Pending', 55],
          ['Failed', 10],
          ['Success', 18],
        ],

        type: 'donut'
      },
      donut: {
        label: {
          show: false
        },
        title: 'Status',
        width: 35,

      },

      legend: {
        hide: true
        // or hide: 'data1'
        // or hide: ['data1', 'data2']
      },
      color: {
        pattern: ['#6495ed', '#5ac146', '#8b5edd']
      }
    });
  }


}
